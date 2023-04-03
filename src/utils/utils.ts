import axios, { AxiosError } from 'axios'
import config from 'src/constant/config'
import { HttpStatusCode } from './../constant/httpStatusCode'
import userImage from 'src/assets/images/user.svg'

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

export function rateSale(original: number, sale: number) {
  return Math.round(((original - sale) / original) * 100) + '%'
}

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export function generateNameId({ name, id }: { name: string; id: string }) {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export function getIdFromNameId(nameId: string) {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}

export function getAvatarUrl(avatarName?: string) {
  return avatarName ? `${config.baseUrl}images/${avatarName}` : userImage
}
