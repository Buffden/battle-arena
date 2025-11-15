module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['server.js', 'src/**/*.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],

  // Test file patterns
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // Module resolution
  moduleFileExtensions: ['js', 'json'],

  // Setup files
  setupFilesAfterEnv: [],

  // Verbose output
  verbose: true
};
