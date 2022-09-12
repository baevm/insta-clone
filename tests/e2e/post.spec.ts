import { expect, test } from '@playwright/test'
import prisma from '../../src/utils/prisma'

// data to be removed after test
const testUserSignup = {
  username: 'test_e2e',
  email: 'test@test.com',
  password: 'password',
}

test.afterAll(async () => {
  await prisma.user.delete({ where: { email: testUserSignup.email } })
})

// create post

test('should successfully create post and show toast', async ({ page }) => {
  await page.goto('http://localhost:3000/signup')

  await page.fill('input[placeholder="email"]', testUserSignup.email)
  await page.fill('input[placeholder="username"]', testUserSignup.username)
  await page.fill('input[placeholder="password"]', testUserSignup.password)
  await page.press('button[type="submit"]', 'Enter')

  await page.goto('http://localhost:3000/login')
  await page.fill('input[placeholder="email"]', testUserSignup.email)
  await page.fill('input[placeholder="password"]', testUserSignup.password)
  await page.press('button[type="submit"]', 'Enter')

  await expect(page).toHaveURL('http://localhost:3000/')

  await page.press('button[aria-label="Create post"]', 'Enter')

  await page.setInputFiles('input[type="file"]', './public/images.png')
  await page.press('button[aria-label="Share post"]', 'Enter')

  await expect(page.locator('text=Post created')).toBeVisible()
})
