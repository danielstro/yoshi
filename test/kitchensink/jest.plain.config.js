module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/integration/errors.test.js'],
  testEnvironment: require.resolve('./plainEnvironment'),
  // transform: { '^.+\\.js$': './jest.transform.js' },
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./plainGlobalSetup'),
  globalTeardown: require.resolve('./plainGlobalTeardown'),
};
