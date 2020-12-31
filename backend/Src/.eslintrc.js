module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2020': true,
    'jest':true
  },
  'extends':[
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  'parserOptions': {
    'ecmaVersion': 11
  },
  'rules': {
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'indent': [
      'error',
      2
    ],
    'no-unused-vars': [2, { 'args': 'all', 'argsIgnorePattern': '^_' }],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq':'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
  }
}
