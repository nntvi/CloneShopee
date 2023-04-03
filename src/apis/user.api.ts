import { User } from 'src/types/user.types'
import { SuccessResponseApi } from 'src/types/utils.types'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  new_password?: string
}

const userApi = {
  getProfile() {
    return http.get<SuccessResponseApi<User>>('me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponseApi<User>>('user', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponseApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
