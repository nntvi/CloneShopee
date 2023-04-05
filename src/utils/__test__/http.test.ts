import { beforeEach, describe, expect, it } from 'vitest'
import http, { Http } from '../http'
import { HttpStatusCode } from 'src/constant/httpStatusCode'
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '../auth'
// vì file này là test riêng http nên chỉ xài http thôi
// không có import mấy api bên file api qua
// vì lỡ sau này bên file api có gì thay đôi
// thì cũng ko ảnh hưởng đến file test này

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })
  const access_token_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjQxYTkyNmQ3YzYyMDM0MDg1NmU1MyIsImVtYWlsIjoidmlhaWJpQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDQtMDVUMDM6NDg6MDIuNjI3WiIsImlhdCI6MTY4MDY2NjQ4MiwiZXhwIjoxNjgwNjY2NDgzfQ.VqDTk-wKu77fLXf7BBQ42wBcKf8LMk9jU_zTG9KcARw'
  const refresh_token_1000days =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjQxYTkyNmQ3YzYyMDM0MDg1NmU1MyIsImVtYWlsIjoidmlhaWJpQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDQtMDVUMDM6NDg6MDIuNjI3WiIsImlhdCI6MTY4MDY2NjQ4MiwiZXhwIjoxNzY3MDY2NDgyfQ.M2i-4_5mPIhZmLNghsQN4E2MdssfoXgWI49pXopNNnw'
  it('Gọi API', async () => {
    const res = await http.get('products') // phải gọi như này, ko nên gọi productApi.getProducts()
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
  it('Auth Request', async () => {
    await http.post('login', {
      email: 'userVi@gmail.com',
      password: '123123'
    })
    const res = await http.get('me ')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
  it('Refresh token ', async () => {
    saveAccessTokenToLocalStorage(access_token_1s)
    saveRefreshTokenToLocalStorage(refresh_token_1000days)
    const http = new Http().instance
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
