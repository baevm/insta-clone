import { test, expect } from '@playwright/test'

test('test 404', async ({ page }) => {
  const res = await page.goto('/p/12312378zdfszaeqwe1a12313')
  expect(res?.status()).toBe(404)
})
