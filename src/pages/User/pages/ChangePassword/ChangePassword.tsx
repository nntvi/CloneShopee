import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponseApi } from 'src/types/utils.types'
import { UserSchema, userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const changePasswordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const methods = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = methods

  const changePasswordMutation = useMutation(userApi.updateProfile)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await changePasswordMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
        const formError = error.response?.data.data
        // Lặp Obj set error
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
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
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-[20%] truncate pt-3 text-right'>Mật khẩu cũ</div>
            <div className='w-[80%] pl-5'>
              <Input
                register={register}
                placeholder='Mật khẩu cũ'
                name='password'
                type='password'
                errorMessage={errors.password?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
                className='relative'
              />
            </div>
          </div>

          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-[20%] truncate pt-3 text-right'>Mật khẩu mới</div>
            <div className='w-[80%] pl-5'>
              <Input
                register={register}
                placeholder='Mật khẩu mới'
                name='new_password'
                type='password'
                errorMessage={errors.new_password?.message}
                classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
                className='relative'
              />
            </div>
          </div>

          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-[20%] truncate pt-3 text-right'>Nhập lại mật khẩu mới</div>
            <div className='w-[80%] pl-5'>
              <Input
                register={register}
                placeholder='Mật khẩu mới'
                name='confirm_password'
                type='password'
                errorMessage={errors.confirm_password?.message}
                classNameInput=' w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-400 focus:shadow-sm'
                className='relative'
              />
            </div>
          </div>

          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-[20%] truncate pt-3 text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button type='submit' className='flex h-9 items-center bg-orange px-5 text-center text-sm text-white'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
