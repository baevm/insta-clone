import { expect, test } from '@playwright/test'
import prisma from '../src/utils/prisma'

// data to be removed after test
const testUserSignup = {
  username: 'test_e2e',
  email: 'test@test.com',
  password: 'password',
}

test.afterAll(async () => {
  await prisma.user.delete({ where: { email: testUserSignup.email } })
})

//signup
test('should successfully create account', async ({ page }) => {
  await page.goto('http://localhost:3000/signup')

  await page.fill('input[placeholder="email"]', testUserSignup.email)
  await page.fill('input[placeholder="username"]', testUserSignup.username)
  await page.fill('input[placeholder="password"]', testUserSignup.password)
  await page.press('button[type="submit"]', 'Enter')

  await expect(page.locator('div[role="toast"]')).toContainText('Account successfully created.')
})

test('should contain error on signup form if users exists', async ({ page }) => {
  await page.goto('http://localhost:3000/signup')

  await page.fill('input[placeholder="email"]', testUserSignup.email)
  await page.fill('input[placeholder="username"]', testUserSignup.username)
  await page.fill('input[placeholder="password"]', testUserSignup.password)
  await page.press('button[type="submit"]', 'Enter')

  await expect(page.locator(`text=User with email ${testUserSignup.email} already exists`)).toBeVisible()
})

// login
test('should show error if user not found', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  await page.fill('input[placeholder="email"]', 'testtesttesttesttest@test.com')
  await page.fill('input[placeholder="password"]', 'password')
  await page.press('button[type="submit"]', 'Enter')

  await expect(page.locator(`text=User with this email doesn't exist`)).toBeVisible()
})

test('should successfully redirect after login', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  await page.fill('input[placeholder="email"]', testUserSignup.email)
  await page.fill('input[placeholder="password"]', testUserSignup.password)
  await page.press('button[type="submit"]', 'Enter')

  await expect(page).toHaveURL('http://localhost:3000/')
})
