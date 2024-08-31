import js from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        chrome: true
      }
    },
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    ignores: [
      '.DS_Store',
      'node_modules',
      'build',
      'dist',
      'coverage',
      '.vercel',
      '.env',
      '.env.*',
      '!.env.example',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock'
    ]
  }
];
