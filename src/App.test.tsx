import matchers from '@testing-library/jest-dom/matchers'
import { describe, expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { logScreen } from './utils/testUI'

expect.extend(matchers)

describe('App', () => {
  // làm thế nào để test chỗ render của app
  // sd import { render } @testing-library/react
  // vì app của mình là client, để test render trên node.js thì phải sd thư viện trên

  // lần đầu chạy thì sẽ ra lỗi
  // báo lỗi ở useRoutes, vì App đang xài useRouteElements
  // cái này phải dính đến BrowserRouter
  // => mà <BrowserRouter> đang bọc ngoài App </BrowserRouter>
  // mình đang run test cho mỗi App => lỗi

  // vì cần đợi render nên xài async await ha
  test('App render và chuyển trang', async () => {
    // render(
    //   <BrowserRouter>
    //     <App />
    //   </BrowserRouter>,
    //   {}
    // )

    const user = userEvent.setup()
    render(<App />, {
      wrapper: BrowserRouter
    })
    // verify vào đúng trang chủ
    /**
     * waitFor sẽ run callback 1 vài lần
     * cho đến khi hết timeout hoặc expect pass
     * số lần run phụ thuộc vào time out hoặc interval
     * mặc định: ko set thì timeout là 1s và interval là 50ms
     */
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone')
    })

    // verify chuyển sang trang đăng nhập
    await user.click(screen.getByText('Đăng nhập'))
    await waitFor(
      () => {
        expect(document.querySelector('title')?.textContent).toBe('Đăng nhập | Shopee Clone')
        expect(screen.queryByText('Bạn chưa có tài khoản?')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
    screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  // => Đặt TH 1 user vào 1 url không tồn tại??
  // 1.
  test('Về trang not found', async () => {
    const badRoute = '/some/bad/route'
    // BrowserRouter ko có truyền tham số vào được
    // nên để truyền được một url sai như trên
    // phải xài memory Router
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App />
      </MemoryRouter>
    )
    // await waitFor(() => {
    //   expect(screen.queryByText(/Page Not Found/i)).toBeInTheDocument()
    // })
    await logScreen()
  })
})
