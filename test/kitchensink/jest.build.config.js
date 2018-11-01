module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/*.test.js'],
  // transform: { '^.+\\.js$': './jest.transform.js' },
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./buildGlobalSetup'),
  globalTeardown: require.resolve('./buildGlobalTeardown'),
};
