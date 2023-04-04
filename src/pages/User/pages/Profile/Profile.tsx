import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.types'
import { saveProfileToLocalStorage } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'
import config from 'src/constant/config'
import InputFile from 'src/components/InputFile'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
// vì date_of_birth ban đầu khai báo kiểu Date (new Date)
// mà response trả về date_of_birth lại là string
// phải tạo formdata mới theo cách loại bỏ và ghi đè kiểu dữ liệu lại
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

function Info() {
  const {
    register,
    formState: { errors },
    control
  } = useFormContext<FormData>()
  return (
    <>
      <Helmet>
        <title>Tài khoản | Shopee Clone</title>
        <meta name='description' content='Quản lý tài khoản cho dự án shopee clone by Tuong Vi' />
      </Helmet>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='w-[20%] truncate pt-3 text-right'>Tên</div>
        <div className='w-[80%] pl-5'>
          <Input
            register={register}
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
          />
        </div>
      </div>

      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='w-[20%] truncate pt-3 text-right'>Số điện thoại</div>
        <div className='w-[80%] pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}
export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const profile = profileData?.data.data
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    control
  } = methods
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  // -------------------- upload img --------------------
  const [fileImage, setFileImage] = useState<File>()
  const previewImage = useMemo(() => {
    return fileImage ? URL.createObjectURL(fileImage) : ''
  }, [fileImage])
  const avatar = watch('avatar')
  const uploadImageMutation = useMutation(userApi.uploadAvatar)
  const handleChangeImage = (file?: File) => {
    setFileImage(file)
  }
  // ------------------ submit update -------------------
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (fileImage) {
        const form = new FormData()
        form.append('image', fileImage)
        const responseUpload = await uploadImageMutation.mutateAsync(form)
        avatarName = responseUpload.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      saveProfileToLocalStorage(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormDataError>>(error)) {
        const formError = error.response?.data.data
        // Lặp Obj set error
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
              <div className='w-[80%] pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>

            <Info />
            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
              <div className='w-[20%] truncate pt-3 text-right'>Địa chỉ</div>
              <div className='w-[80%] pl-5'>
                <Input
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorMessage={errors.address?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  onChange={field.onChange}
                  value={field.value}
                  errorMessage={errors.date_of_birth?.message}
                />
              )}
            />

            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
              <div className='w-[20%] truncate pt-3 text-right' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button type='submit' className='flex h-9 items-center bg-orange px-5 text-center text-sm text-white'>
                  Lưu
                </Button>
              </div>
            </div>
          </div>

          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt=''
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChange={handleChangeImage} />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
