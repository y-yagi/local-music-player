import { test, expect } from "@playwright/test";

test("file upload test", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click('label:has-text("Upload a file")'),
  ]);

  await fileChooser.setFiles("tests/fixtures/timpani.mp3");
  const table = page.locator("tbody");
  await expect(table).toContainText("timpani.mp3");
});
