import { UseFormGetValues, type RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự '
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5-160 ký tự '
    }
  },
  password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự '
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5-160 ký tự '
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Xác nhận mật khẩu'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự '
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5-160 ký tự '
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Mật khẩu xác nhận không khớp'
        : undefined
  }
})

// =================== Yup ====================
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5-160 ký tự ')
    .max(160, 'Độ dài từ 5-160 ký tự '),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(5, 'Độ dài từ 5-160 ký tự ')
    .max(160, 'Độ dài từ 5-160 ký tự '),
  confirm_password: yup
    .string()
    .required('Xác nhận mật khẩu')
    .min(5, 'Độ dài từ 5-160 ký tự ')
    .max(160, 'Độ dài từ 5-160 ký tự ')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp') // tham chiếu đến giá trị password
})

const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
