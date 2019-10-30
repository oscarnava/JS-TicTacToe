module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    Board: 'readonly',
    Player: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    'no-shadow': 0,
    'no-param-reassign': 0,
    'eol-last': 0,
  },
};
