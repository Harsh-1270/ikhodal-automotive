import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',

    /* Global timeout per test (reasonable for CI + real users) */
    timeout: 30_000,

    /* Expect assertions timeout */
    expect: {
        timeout: 5_000,
    },

    /* Run tests in parallel safely */
    fullyParallel: true,

    /* Fail build if test.only is left */
    forbidOnly: !!process.env.CI,

    /* Retry only in CI (avoids local frustration) */
    retries: process.env.CI ? 2 : 0,

    /* Reporter setup */
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
    ],

    use: {
        /* Frontend only */
        baseURL: 'http://127.0.0.1:3000',

        /* Chromium only (as requested) */
        browserName: 'chromium',

        /* Stability */
        headless: true,
        viewport: { width: 1280, height: 800 },

        /* Debug-friendly */
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',

        /* Avoid flaky animations */
        actionTimeout: 10_000,
    },
});
