module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/*.test.js'],
  // transform: { '^.+\\.js$': './jest.transform.js' },
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./setup.build'),
  globalTeardown: require.resolve('./teardown.build'),
};
