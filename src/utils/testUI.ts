import { screen, waitFor, waitForOptions } from '@testing-library/react'
import { expect } from 'vitest'

const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })

export const logScreen = async (
  body: HTMLElement = document.body.parentElement as HTMLElement,
  option?: waitForOptions
) => {
  const { timeout = 1000 } = option || {}
  await waitFor(
    async () => {
      expect(await delay(timeout - 100)).toBe(true)
    },
    {
      ...option,
      timeout
    }
  )
  screen.debug(body, 999999)
}
