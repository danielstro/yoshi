const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const TestSetup = require('../setup');

global.testSetup = new TestSetup(__dirname);

module.exports = async () => {
  await setupPuppeteer();

  await global.testSetup.setup();
  await global.testSetup.scripts.build();

  global.result = await global.testSetup.scripts.serve();
};
