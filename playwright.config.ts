import { defineConfig, devices } from '@playwright/test';

const previewUrl = 'http://localhost:4322';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: previewUrl,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'yarn preview:e2e',
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
