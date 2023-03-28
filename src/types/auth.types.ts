import { User } from './user.types'
import { SuccessResponseApi } from './utils.types'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  expires: string
  user: User
}>
