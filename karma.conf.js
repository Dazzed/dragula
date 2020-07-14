// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

const customLaunchers = require('./scripts/sauce-browsers').customLaunchers;

module.exports = function (config) {
  const configuration = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    // angularCli: {
    //   environment: 'dev'
    // },
    reporters: config.angularCli && config.angularCli.codeCoverage
          ? ['progress', 'coverage-istanbul']
          : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    browsers: ['Chrome'],
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--disable-translate', '--disable-extensions',
                '--no-first-run', '--disable-background-networking',
                '--remote-debugging-port=9223']
      }
    },
    mime: { 'text/x-typescript': ['ts', 'tsx'] },
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['CustomChromeHeadless'];
  }

  if (process.env.SAUCE && false) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
      process.exit(1);
    }

    configuration.plugins.push(require('karma-sauce-launcher'));
    configuration.reporters.push('saucelabs');
    configuration.sauceLabs = {
      verbose: true,
      testName: 'ng2-bootstrap unit tests',
      recordScreenshots: false,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    };
    configuration.captureTimeout = 0;
    configuration.customLaunchers = customLaunchers();
    configuration.browsers = Object.keys(configuration.customLaunchers);
    configuration.concurrency = 3;
    configuration.browserDisconnectTolerance = 2;
    configuration.browserNoActivityTimeout = 20000;
    configuration.browserDisconnectTimeout = 5000;
  }

  config.set(configuration);
};
