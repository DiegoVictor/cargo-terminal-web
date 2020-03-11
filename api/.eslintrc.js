module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'class-methods-use-this': 'off',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
  },
};
