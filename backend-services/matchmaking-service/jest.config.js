module.exports = {
  // Only run files that match test patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  // Ignore helper files and node_modules
  testPathIgnorePatterns: [
    '/node_modules/',
    '/helpers/',
    '/utils/',
    'test-helpers.js',
    String.raw`.*helper.*\.js$`
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/**/test-helpers.js',
    '!src/**/*helper*.js'
  ]
};
