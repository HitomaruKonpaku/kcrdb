const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const globals = require('globals')
const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2, {
        ignoredNodes: ['PropertyDefinition'],
      }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'class-methods-use-this': 'off',
      'lines-between-class-members': 'off',
      'max-len': 'off',
      'no-debugger': 'warn',
      'no-empty-function': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'object-curly-newline': 'off',
    },
  },
]
