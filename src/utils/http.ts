import {
  clearAccessTokenFromLocalStorage,
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage
} from './auth'
import { toast } from 'react-toastify'
import { HttpStatusCode } from './../constant/httpStatusCode'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { AuthResponse } from 'src/types/auth.types'
import path from 'src/constant/path'
import config from 'src/constant/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    // init axios
    ;(this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    })),
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers.Authorization = this.accessToken
            return config
          }
          return config
        },
        (error) => Promise.reject(error)
      )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        console.log('response', response)
        if (url === path.login || url === path.register) {
          this.accessToken = (response.data as AuthResponse).data.access_token
          saveAccessTokenToLocalStorage(response.data.data.access_token)
          saveProfileToLocalStorage(response.data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearAccessTokenFromLocalStorage()
        }
        return response
      },

      // xử lí lỗi ko phải 422
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const errorMessage = data?.message || error.message
          toast.error(errorMessage)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
