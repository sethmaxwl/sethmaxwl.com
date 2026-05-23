import { defineConfig } from 'astro/config';

const brewfileDirectivePattern = /^(brew|cask|tap|mas|vscode|font|whalebrew)\s+['"][^'"]+['"]/;

function isBrewfileCode(value = '') {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.length > 0 &&
    lines.every((line) => line.startsWith('#') || brewfileDirectivePattern.test(line))
  );
}

function remarkBrewfileCodeLanguage() {
  return (tree) => {
    function visit(node) {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (node.type === 'code' && !node.lang && isBrewfileCode(node.value)) {
        node.lang = 'brewfile';
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
}

export default defineConfig({
  site: 'https://sethmaxwl.com',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBrewfileCodeLanguage],
    shikiConfig: {
      theme: 'rose-pine-dawn',
      langAlias: {
        brewfile: 'ruby'
      }
    }
  }
});
