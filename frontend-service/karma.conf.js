// Karma configuration file for Angular tests
module.exports = function karma(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: {
      jasmine: {
        // You can add configuration options for Jasmine here
        random: false,
        seed: '4321',
        stopOnFailure: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('node:path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'text' }, { type: 'lcov' }],
      check: {
        global: {
          statements: 75,
          branches: 70,
          functions: 70,
          lines: 75
        }
      },
      includeAllSources: true,
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    restartOnFileChange: false,
    singleRun: true,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--remote-debugging-port=9222'
        ]
      }
    }
  });
};
