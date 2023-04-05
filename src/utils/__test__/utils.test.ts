import { describe, it, expect } from 'vitest'
import { checkAxiosError, isAxiosUnprocessableEntityError } from '../utils'
import { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constant/httpStatusCode'

// describe: mô tả ngữ cảnh || đơn vị được test
describe('checkAxiosError', () => {
  // it dùng để ghi chú TH cần test
  it('checkAxiosError trả về boolean', () => {
    // expect dùng để mong đợi giá trị trả về

    // truyền vào 1 error bt vào => trả false
    // vì đây là check xem phải lỗi axios hay ko
    expect(checkAxiosError(new Error())).toBe(false)

    // nếu mà là lỗi axios thì trả true
    expect(checkAxiosError(new AxiosError())).toBe(true)
  })
})

// kiểm tra lỗi 422 => truyền vào 1 lỗi không phải 422 => return false

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosUnprocessableEntityError trả về boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
