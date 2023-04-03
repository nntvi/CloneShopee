import { UseFormGetValues, type RegisterOptions } from 'react-hook-form'
import { FormDataPrice } from 'src/pages/ProductList/AsideFilter/AsideFilter'
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

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as FormDataPrice
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

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
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'), // tham chiếu đến giá trị password
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá trị nhập chưa hợp lệ',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá trị nhập chưa hợp lệ',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(160, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Vui lòng chọn ngày trong quá khứ'),
  password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password']
})
const loginSchema = schema.omit(['confirm_password'])

export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
