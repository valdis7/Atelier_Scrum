import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      // Les routeurs reçoivent db avant que les stories ne l'utilisent.
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
];
