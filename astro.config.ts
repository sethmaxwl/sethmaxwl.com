import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://sethmaxwl.com',
  output: 'static',
  trailingSlash: 'always',
  prerenderConflictBehavior: 'error',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-display',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
      options: {
        experimental: {
          variableAxis: {
            opsz: [['6', '72']],
          },
        },
      },
    },
    {
      provider: fontProviders.google(),
      name: 'Public Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_ANALYTICS_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        startsWith: 'G-',
      }),
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'everforest-light',
      langAlias: {
        brewfile: 'ruby',
      },
    },
  },
  experimental: {
    contentIntellisense: true,
  },
});
