module.exports = {
  '*.{js,mjs,cjs,ts,tsx}': ['corepack pnpm exec eslint --fix --max-warnings 0', 'corepack pnpm exec prettier --write'],
  '*.{json,md,yml,yaml,css,html}': ['corepack pnpm exec prettier --write'],
};
