const testSetup = require('../../test-setup');
const webpack = require('./webpack');

describe('integration', () => {
  describe('start', () => {
    let result;

    beforeAll(async () => {
      result = await testSetup.scripts.start();
    }, 10 * 1000);

    afterAll(async () => {
      await result.done();
    });

    webpack();
  });

  describe('build', () => {
    let result;

    beforeAll(async () => {
      await testSetup.scripts.build();
      result = await testSetup.scripts.serve();
    }, 10 * 1000);

    afterAll(async () => {
      await result.done();
    });

    webpack();
  });
});
