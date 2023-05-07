import matchers from '@testing-library/jest-dom/matchers'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import path from 'src/constant/path'
import { logScreen, renderWithRouter } from 'src/utils/testUI'
import { beforeAll, describe, expect, it } from 'vitest'

// để xài được toBeInTheDocument thì import matcher
expect.extend(matchers)
describe('Login', () => {
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
  })
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    const submitButton = document.querySelector('form button[type="submit"]') as Element
    fireEvent.click(submitButton)
    await waitFor(async () => {
      expect(await screen.findByText('Email là bắt buộc')).toBeTruthy()
      expect(await screen.findByText('Mật khẩu là bắt buộc')).toBeTruthy()
    })
    // await logScreen()
  })

  it('Hiển thị lỗi không đúng định dạng', async () => {
    const emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    const btnSubmit = document.querySelector('form button[type="submit"]') as HTMLButtonElement

    fireEvent.change(emailInput, {
      target: {
        value: 'test'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.click(btnSubmit)
    expect(await screen.findByText('Email không đúng định dạng')).toBeTruthy()
    expect(await screen.findByText('Độ dài từ 5-160 ký tự')).toBeTruthy()
    // await logScreen()
  })
})
