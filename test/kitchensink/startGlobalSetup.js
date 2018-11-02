const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const TestSetup = require('../setup');

global.testSetup = new TestSetup(__dirname);

module.exports = async () => {
  process.env = {
    ...process.env,

    // disable CI env vars
    BUILD_NUMBER: '',
    TEAMCITY_VERSION: '',
    ARTIFACT_VERSION: '',
  };

  await setupPuppeteer();

  await global.testSetup.setup();
  global.result = await global.testSetup.scripts.start();
};
