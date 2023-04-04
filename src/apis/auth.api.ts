import { AuthResponse } from 'src/types/auth.types'
import http from 'src/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(URL_REGISTER, body)
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body)
export const logout = () => http.post(URL_LOGOUT)
