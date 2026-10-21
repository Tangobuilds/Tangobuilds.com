// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Actions sets SITE_URL and BASE_PATH from the Pages settings, so the
// same build works on tangobuilds.github.io/Tangobuilds.com and later on
// tangobuilds.com without changing this file.
export default defineConfig({
  site: process.env.SITE_URL || 'https://tangobuilds.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
