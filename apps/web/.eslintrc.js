// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@movies/eslint-config/eslint-nextjs.js'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/pages/**', './next.config.mjs'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: { project: path.resolve(__dirname, 'tsconfig.json') },
    },
  },
  root: true,
};
