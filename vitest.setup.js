import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import config from './src/constant/config'
import httpStatusCode from './src/constant/httpStatusCode'
import { rest } from 'msw'

const loginResponse = [
  {
    message: 'Đăng nhập thành công',
    data: {
      access_token:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjQxYTkyNmQ3YzYyMDM0MDg1NmU1MyIsImVtYWlsIjoidmlhaWJpQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDUtMDdUMDg6NTA6NTEuNzI3WiIsImlhdCI6MTY4MzQ0OTQ1MSwiZXhwIjoxNjgzNDQ5NDUyfQ.lg7AlSg13UQgVYFlYLgVF5EzhHV-MHUF0LsG6zcZefg',
      expires: 1,
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjQxYTkyNmQ3YzYyMDM0MDg1NmU1MyIsImVtYWlsIjoidmlhaWJpQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDUtMDdUMDg6NTA6NTEuNzI3WiIsImlhdCI6MTY4MzQ0OTQ1MSwiZXhwIjoxNzY5ODQ5NDUxfQ.duj_kXqo8n1ThNUcJfQhIBNeYwFsjX6H137A42OMURc',
      expires_refresh_token: 86400000,
      user: {
        _id: '64241a926d7c620340856e53',
        roles: ['User'],
        email: 'viaibi@gmail.com',
        createdAt: '2023-03-29T11:01:38.566Z',
        updatedAt: '2023-03-29T11:01:38.566Z',
        __v: 0
      }
    }
  }
]

export const restHandlers = [
  rest.post(`${config.baseUrl}login`, (req, res, ctx) => {
    return res(ctx.status(httpStatusCode.Ok), ctx.json(loginResponse))
  })
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
