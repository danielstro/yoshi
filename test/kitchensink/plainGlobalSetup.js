const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const TestSetup = require('../setup');

global.testSetup = new TestSetup(__dirname);

module.exports = async () => {
  await setupPuppeteer();

  await global.testSetup.setup();
};
