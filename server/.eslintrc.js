module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      spread: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ['react'],
  globals: {
    graphql: false,
    window: false,
    document: false,
    google: false,
    css: false
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
      }
    }
  }
}
