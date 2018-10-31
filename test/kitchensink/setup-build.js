const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');
const TestSetup = require('../setup');

const testSetup = new TestSetup(__dirname);

let result;

module.exports.setup = async () => {
  await setupPuppeteer();

  await testSetup.setup();

  await testSetup.scripts.build();

  result = await testSetup.scripts.serve();
};

module.exports.teardown = async () => {
  await teardownPuppeteer();

  await testSetup.teardown();

  await result.done();
};
