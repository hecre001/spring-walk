import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'style.css'), 'utf8');
const js = readFileSync(join(root, 'script.js'), 'utf8');

const required = [
  [html, 'Dayu Park Stroll'],
  [html, 'Interactive Park Narrative'],
  [html, 'Lakeside Pavilion'],
  [html, 'Willow Garden'],
  [html, 'urban garden'],
  [html, 'images/hero-gate.jpg'],
  [html, 'The park opens in two directions.'],
];

const forbidden = [
  'Spring Walk',
  'Wild Moments',
  'Cherry blossoms',
  'magpie',
  'Wildlife Trail',
  'Rainy Detour',
  'Pexels',
];

for (const [content, text] of required) {
  assert.ok(content.includes(text), `Expected updated theme content: ${text}`);
}

for (const text of forbidden) {
  assert.ok(!html.includes(text) && !js.includes(text), `Expected old theme to be removed: ${text}`);
}

console.log('Theme content check passed.');
