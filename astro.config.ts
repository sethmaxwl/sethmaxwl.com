import { defineConfig } from 'astro/config';
import { remarkBrewfileCodeLanguage } from './src/markdown/remarkBrewfileCodeLanguage.ts';

export default defineConfig({
  site: 'https://sethmaxwl.com',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBrewfileCodeLanguage],
    shikiConfig: {
      theme: 'rose-pine-dawn',
      langAlias: {
        brewfile: 'ruby',
      },
    },
  },
});
