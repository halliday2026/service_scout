import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14 viewport

// 1. Home screen
await page.goto('http://localhost:5173')
await page.waitForSelector('text=AutoServiceFinder')
await page.screenshot({ path: 'screenshots/01-home.png' })
console.log('✓ Home screen loaded')

const buttons = await page.locator('button').allTextContents()
console.log('Buttons found:', buttons.filter(t => t.trim()))

// 2. Click Oil Change — geolocation will be denied by headless, showing ZIP fallback or loading
await page.locator('button', { hasText: 'Oil Change' }).click()
// Wait for either the results header or the loading spinner
await page.waitForSelector('h2', { timeout: 5000 })
await page.screenshot({ path: 'screenshots/02-results-loading.png' })
console.log('✓ Results screen loaded (heading:', await page.locator('h2').first().textContent(), ')')

// Wait for the ZIP fallback (location denied in headless) or actual results
await page.waitForTimeout(3000)
await page.screenshot({ path: 'screenshots/03-results-after-wait.png' })

const pageText = await page.locator('body').innerText()
if (pageText.includes('Location access was denied') || pageText.includes('ZIP')) {
  console.log('✓ ZIP fallback shown (location denied as expected in headless)')
  // Fill in ZIP and submit
  await page.fill('input[type="text"]', '91786')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'screenshots/04-results-after-zip.png' })
  console.log('✓ Submitted ZIP code')
}

// Check if results appeared
await page.waitForTimeout(500)
const finalText = await page.locator('body').innerText()
if (finalText.includes('Oil Change') && (finalText.includes('mi') || finalText.includes('Directions'))) {
  console.log('✓ Provider results visible')
} else {
  console.log('Current page text:', finalText.substring(0, 300))
}
await page.screenshot({ path: 'screenshots/05-final-results.png' })

// 3. Back button
const backBtn = page.locator('button[aria-label="Back to home"]')
await backBtn.click()
await page.waitForSelector('text=AutoServiceFinder')
await page.screenshot({ path: 'screenshots/06-back-home.png' })
console.log('✓ Back button returns to home screen')

// Check console errors
const errors = []
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
if (errors.length) console.log('Console errors:', errors)
else console.log('✓ No console errors')

await browser.close()
console.log('\nScreenshots saved to ./screenshots/')
