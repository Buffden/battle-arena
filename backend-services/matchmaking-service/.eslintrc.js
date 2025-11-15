module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    // Best practices
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',

    // Code style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    '*.test.js',
    '*.spec.js'
  ]
};

