import { FlatCompat } from '@eslint/eslintrc'
import prettierPlugin from 'eslint-plugin-prettier'

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
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
