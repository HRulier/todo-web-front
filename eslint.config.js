import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/*
 Airbnb rules
 Can't use eslint-config-airbnb directly, not compatible with eslint v9 new flat config
*/

const airbnbStyleRules = {
  camelcase: ['error', { properties: 'never' }],
  'comma-dangle': ['error', 'always-multiline'],
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'max-len': ['error', { code: 100, ignoreUrls: true }],
  'no-nested-ternary': 'error',
  'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
};

const airbnbES6Rules = {
  'no-var': 'error',
  'prefer-const': 'error',
  'prefer-destructuring': ['warn', { array: true, object: true }],
  'prefer-template': 'warn',
  'object-shorthand': 'warn',
  'arrow-spacing': ['error', { before: true, after: true }],
  'arrow-body-style': ['warn', 'as-needed'],
  'arrow-parens': ['error', 'always'],
  'keyword-spacing': ['error', { before: true, after: true }],
  'space-before-blocks': 'error',
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    },
  ],
  'space-in-parens': ['error', 'never'],
  'space-infix-ops': 'error',
};

const airbnbBestPractices = {
  'no-param-reassign': ['error', { props: false }],
  'no-unused-expressions': 'error',
  curly: ['error', 'all'],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'prefer-promise-reject-errors': 'error',
  'no-alert': 'error',
};

const airbnbReactRules = {
  'react/jsx-pascal-case': 'error',
  'react/self-closing-comp': 'error',
  'react/no-array-index-key': 'warn',
  'react/jsx-no-bind': ['warn', { allowArrowFunctions: true }],
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
  'react/jsx-uses-react': 'off',
};

const airbnbImportRules = {
  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      // 'newlines-between': 'always',
    },
  ],
  'import/first': 'error',
  'import/no-duplicates': 'error',
  'import/no-unresolved': 'off',
};

const airbnbA11yRules = {
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-has-content': 'error',
  'jsx-a11y/label-has-associated-control': 'warn',
  'jsx-a11y/no-static-element-interactions': 'warn',
};

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
        // ecmaFeatures: {
        // jsx: true,
        // },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: reactPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',

      // Airbnb rules
      ...airbnbStyleRules,
      ...airbnbES6Rules,
      ...airbnbBestPractices,
      ...airbnbReactRules,
      ...airbnbImportRules,
      ...airbnbA11yRules,

      // Prettier integration
      'prettier/prettier': 'error',

      // Turn off rules that conflict with Prettier
      ...prettierConfig.rules,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  }
);
