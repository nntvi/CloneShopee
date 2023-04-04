import { URL_REFRESH_TOKEN, URL_LOGIN, URL_REGISTER, URL_LOGOUT } from './../apis/auth.api'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage,
  saveRefreshTokenToLocalStorage
} from './auth'
import { toast } from 'react-toastify'
import { HttpStatusCode } from './../constant/httpStatusCode'
// eslint-disable-next-line import/named
import axios, { AxiosError, type AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.types'
import path from 'src/constant/path'
import config from 'src/constant/config'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponseApi } from 'src/types/utils.types'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    // init axios
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10, // 10s
        'expire-refresh-token': 60 * 60 // 1 h nha
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          this.accessToken = (response.data as AuthResponse).data.access_token
          this.refreshToken = (response.data as AuthResponse).data.refresh_token
          saveAccessTokenToLocalStorage(this.accessToken)
          saveRefreshTokenToLocalStorage(this.refreshToken)
          saveProfileToLocalStorage(response.data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLocalStorage()
        }
        return response
      },

      // xử lí lỗi ko phải 422
      (error: AxiosError) => {
        // chỉ show lỗi 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const errorMessage = data?.message || error.message
          // if (error.code !== 'ECONNABORTED') {
          //   toast.error(errorMessage)
          // }
          toast.error(errorMessage)
        }
        // Unauthorized (401) có nhiều TH
        if (isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // TH token hết hạn và request đó không phải là của request refresh token
          // nghĩa là những api bình thuờng mà hết hạn
          // thì gọi refresh token

          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // hạn chế gọi 2 lần refresh-token-api

            // ví dụ cho TH ta thấy bên tab network api refresh token xuất hiện hơn 1 lần sau mỗi lần reload
            // ------------------ 1 2 3 4 5 6
            // purchase---------- 1...3
            // me-------------------2.....5
            // refreshToken-----------3.4
            // gọi lại purchase---------4...6
            // refreshToke mới cho me-----5.6
            // gọi lại me-------------------6

            // => sẽ thấy có những lần api gọi refresh token hiện ra 2 lần ...
            // fix TH này ta sẽ giữ lại refreshToken trong vòng 10s ví dụ v
            // miễn là nó nhỏ hơn thời time expire-refresh-token bên trên

            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              if (config.headers) {
                config.headers.Authorization = access_token
              }
              // nghĩa là tiếp tục gọi là request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, Authorization: access_token } })
            })
          }
          this.accessToken = ''
          this.refreshToken = ''
          clearLocalStorage()
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        saveAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        this.accessToken = ''
        this.refreshToken = ''
        clearLocalStorage()
        throw error
      })
  }
}

const http = new Http().instance

export default http
