import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "buyer-walkthrough.record.spec.ts",
  timeout: 130_000,
  fullyParallel: false,
  reporter: "list",
  outputDir: "/home/ubuntu/caffio-turnkey-bundle/walkthrough/raw",
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 720 },
    video: { mode: "on", size: { width: 1280, height: 720 } },
    trace: "off",
  },
  projects: [{ name: "buyer-walkthrough", use: { browserName: "chromium" } }],
  webServer: {
    command: "pnpm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
