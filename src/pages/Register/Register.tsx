import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerAccount } from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.types'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

// -------------- validate cách cũ
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

// -------------- validate cách mới
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation('profile')
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  // validate theo cách cũ
  // const rules = getRules(getValues)

  const onSubmit = handleSubmit(
    (data) => {
      const body = omit(data, 'confirm_password')
      registerAccountMutation.mutate(body, {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          setProfile(data.data.data.user)
          toast.success('Hello, Welcome to my project!')
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
            const formError = error.response?.data.data
            // Lặp Obj set error
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key as keyof Omit<FormData, 'confirm_password'>, {
                  message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                  type: 'Server'
                })
              })
            }
            // set từng cái

            // if (formError?.email) {
            //   setError('email', {
            //     message: formError.email,
            //     type: 'Server'
            //   })
            // }
            // if (formError?.password) {
            //   setError('password', {
            //     message: formError.password,
            //     type: 'Server'
            //   })
            // }
          }
        }
      })
    }
    // (_) => {
    //   // handle lỗi
    //   const password = getValues('password')
    // }
  )

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  return (
    <div className='bg-orange'>
      <Helmet>
        <title>{t('register')} | Shopee Clone</title>
        <meta name='description' content={t('register')} />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng kí</div>
              <Input
                type='email'
                errorMessage={errors.email?.message}
                placeholder={'Email'}
                name='email'
                className={'mt-8'}
                register={register}
              />
              <Input
                type='password'
                errorMessage={errors.password?.message}
                placeholder={'Password'}
                name='password'
                className={'mt-8'}
                register={register}
                classNameEye='absolute top-[15px] right-[10px] h-3 w-3 cursor-pointer'
              />
              <Input
                type='password'
                errorMessage={errors.confirm_password?.message}
                placeholder={'Confirm password'}
                name='confirm_password'
                className={'mt-8'}
                register={register}
                classNameEye='absolute top-[15px] right-[10px] h-3 w-3 cursor-pointer'
              />

              <div className='mt-3'>
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Đăng kí
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link to={'/login'} className='ml-1 text-red-400'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
