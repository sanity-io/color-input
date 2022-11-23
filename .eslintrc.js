module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  globals: {
    __DEV__: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    react: {version: '16.9.0'},
  },
  extends: ['sanity', 'sanity/react', 'plugin:react-hooks/recommended', 'prettier'],
  rules: {
    camelcase: ['error', {allow: ['^unstable_', '^Unstable_']}],
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react/require-default-props': 'off',
  },
  plugins: ['prettier', 'react'],
}
