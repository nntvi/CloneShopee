import { HttpStatusCode } from './../constant/httpStatusCode'
import axios, { AxiosError } from 'axios'

export function checkAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return checkAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

// cú pháp `-?` -> loại bỏ undefined của key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
