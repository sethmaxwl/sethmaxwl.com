const brewfileDirectivePattern = /^(brew|cask|tap|mas|vscode|font|whalebrew)\s+['"][^'"]+['"]/;

export function isBrewfileCode(value = '') {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.length > 0 &&
    lines.every((line) => line.startsWith('#') || brewfileDirectivePattern.test(line))
  );
}

export function remarkBrewfileCodeLanguage() {
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
