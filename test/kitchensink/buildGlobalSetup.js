const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const TestSetup = require('../setup');

global.testSetup = new TestSetup(__dirname);

module.exports = async () => {
  process.env = {
    ...process.env,

    // enable CI env vars
    BUILD_NUMBER: 1,
    TEAMCITY_VERSION: 1,
    ARTIFACT_VERSION: '1.0.0-SNAPSHOT',
  };

  await setupPuppeteer();

  await global.testSetup.setup();
  await global.testSetup.scripts.build();

  global.result = await global.testSetup.scripts.serve();
};
