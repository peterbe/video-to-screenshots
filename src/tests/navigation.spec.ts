import { expect, test } from "@playwright/test"

test("home page", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle("Video to Screenshots")

  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A web app to turn a video file into screenshots without a server.",
  )

  await page.getByRole("link", { name: "About" }).click()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Back to Home page" })
    .click()
})

test("test", async ({ page }) => {
  await page.goto("http://localhost:4173/")
  await page.getByRole("button", { name: "Choose File" }).click()
  await page
    .getByRole("button", { name: "Choose File" })
    .setInputFiles("sample-video.mov")
  await page.getByRole("img", { name: "At 11s" }).click()
  await page.getByRole("button", { name: "Close" }).click()
  await page.getByRole("button", { name: "Reset" }).click()
})
