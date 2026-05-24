import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBrewfileCode,
  remarkBrewfileCodeLanguage,
} from '../src/markdown/remarkBrewfileCodeLanguage.mjs';

test('isBrewfileCode accepts common Brewfile directives with comments', () => {
  const value = `
    # Core apps
    tap "homebrew/cask"
    brew "git"
    cask "visual-studio-code"
    mas "Keynote", id: 409183694
  `;

  assert.equal(isBrewfileCode(value), true);
});

test('isBrewfileCode rejects empty and unrelated code blocks', () => {
  assert.equal(isBrewfileCode(''), false);
  assert.equal(isBrewfileCode('console.log("hello")'), false);
  assert.equal(isBrewfileCode('brew install git'), false);
});

test('remarkBrewfileCodeLanguage labels unlabeled Brewfile code blocks only', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'code', value: 'brew "git"' },
      { type: 'code', lang: 'sh', value: 'brew "node"' },
      { type: 'code', value: 'console.log("hello")' },
    ],
  };

  remarkBrewfileCodeLanguage()(tree);

  assert.equal(tree.children[0].lang, 'brewfile');
  assert.equal(tree.children[1].lang, 'sh');
  assert.equal(tree.children[2].lang, undefined);
});
