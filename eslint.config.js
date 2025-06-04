const { FlatCompat } = require('@eslint/eslintrc')
const prettierPlugin = require('eslint-plugin-prettier')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

module.exports = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]
