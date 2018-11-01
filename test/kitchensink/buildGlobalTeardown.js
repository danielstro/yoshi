const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');

module.exports = async () => {
  await teardownPuppeteer();

  await global.testSetup.teardown();
  await global.result.done();
};
