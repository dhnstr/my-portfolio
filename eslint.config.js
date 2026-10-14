// Flat config ESLint v10 (pengganti .eslintrc.cjs yang tidak lagi dibaca ESLint 10).
//
// Kompatibilitas TANPA install paket baru (constraint repo ini):
// - `@eslint/js` tidak terpasang -> daftar rule `eslint:recommended` ditulis eksplisit di bawah.
// - `globals` tidak terpasang -> global browser yang dipakai src/ ditulis eksplisit.
// - `eslint-plugin-react-hooks@4.6.2` CRASH di ESLint 10 (context.getSourceCode dihapus;
//   diuji langsung) -> rule react-hooks ditangguhkan sampai plugin di-upgrade (butuh install).
// - `react/prop-types` dimatikan: proyek tidak memakai PropTypes dan paket `prop-types`
//   tidak terpasang (tidak bisa dipenuhi tanpa install) — bukan bagian UI statis.
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';

// eslint:recommended (native rules, ESLint 10)
const recommended = {
  'constructor-super': 'error', 'for-direction': 'error', 'getter-return': 'error',
  'no-async-promise-executor': 'error', 'no-case-declarations': 'error', 'no-class-assign': 'error',
  'no-compare-neg-zero': 'error', 'no-cond-assign': 'error', 'no-const-assign': 'error',
  'no-constant-binary-expression': 'error', 'no-constant-condition': 'error', 'no-control-regex': 'error',
  'no-debugger': 'error', 'no-dupe-args': 'error', 'no-dupe-class-members': 'error',
  'no-dupe-else-if': 'error', 'no-dupe-keys': 'error', 'no-duplicate-case': 'error',
  'no-empty': 'error', 'no-empty-character-class': 'error', 'no-empty-pattern': 'error',
  'no-empty-static-block': 'error', 'no-ex-assign': 'error', 'no-extra-boolean-cast': 'error',
  'no-fallthrough': 'error', 'no-func-assign': 'error', 'no-global-assign': 'error',
  'no-import-assign': 'error', 'no-invalid-regexp': 'error', 'no-irregular-whitespace': 'error',
  'no-loss-of-precision': 'error', 'no-misleading-character-class': 'error',
  'no-mixed-spaces-and-tabs': 'error', 'no-new-native-nonconstructor': 'error',
  'no-nonoctal-decimal-escape': 'error', 'no-obj-calls': 'error', 'no-promise-executor-return': 'error',
  'no-prototype-builtins': 'error', 'no-redeclare': 'error', 'no-self-assign': 'error',
  'no-setter-return': 'error', 'no-shadow-restricted-names': 'error', 'no-sparse-arrays': 'error',
  'no-this-before-super': 'error', 'no-undef': 'error', 'no-unexpected-multiline': 'error',
  'no-unreachable': 'error', 'no-unreachable-loop': 'error', 'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error', 'no-unsafe-optional-chaining': 'error', 'no-unused-labels': 'error',
  'no-unused-private-class-members': 'error', 'no-unused-vars': 'error', 'no-useless-backreference': 'error',
  'no-useless-catch': 'error', 'no-useless-escape': 'error', 'no-with': 'error',
  'require-yield': 'error', 'use-isnan': 'error', 'valid-typeof': 'error',
};

const reactRules = react.configs.flat
  ? { ...react.configs.flat.recommended.rules, ...react.configs.flat['jsx-runtime'].rules }
  : { ...react.configs.recommended.rules, ...react.configs['jsx-runtime'].rules };

export default [
  { ignores: ['dist/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        document: 'readonly', window: 'readonly', localStorage: 'readonly',
        performance: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: { react, 'react-refresh': reactRefresh },
    rules: {
      ...recommended,
      ...reactRules,
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
