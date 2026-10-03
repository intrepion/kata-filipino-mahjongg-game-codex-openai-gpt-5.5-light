const { test, expect } = require("@playwright/test");

test("Play Round starts and populates the audit table", async ({ page }) => {
  await page.goto("/index.html");
  await page.getByRole("button", { name: "Play Round" }).click();

  await expect(page.getByText("Fresh Round starts with one human player and three Simple Legal AI opponents.")).toBeVisible();
  await expect(page.getByText("14 concealed", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Draw" })).toBeEnabled();
  await expect(page.getByText("Ruleset boundary:")).toBeVisible();
});

test("Guided Priority Demo blocks lower-priority claims until passes resolve", async ({ page }) => {
  await page.goto("/index.html");
  await page.getByRole("button", { name: "Guided Priority Demo" }).click();

  await expect(page.getByText("West Win Claim is legal:", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "West may win on 3B" })).toBeVisible();
  await expect(page.getByText("Across pung disabled: Pung waits until all Win Claims pass.")).toBeVisible();
  await expect(page.getByText("Next chow disabled: Chow waits until all Win Claims and Pung claims pass.")).toBeVisible();

  await page.getByRole("button", { name: "Pass Claim" }).click();
  await expect(page.getByRole("button", { name: "Across may pung 3B" })).toBeVisible();
  await expect(page.getByText("Next chow disabled: Chow waits until all Pung claims pass.")).toBeVisible();

  await page.getByRole("button", { name: "Pass Claim" }).click();
  await expect(page.getByRole("button", { name: "Next may chow 3B" })).toBeVisible();
});
