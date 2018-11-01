const { matchCSS, matchJS, initTest } = require('../../utils');

jest.setTimeout(20 * 1000);

describe('errors', () => {
  describe('css', () => {
    it('css inclusion', async () => {
      const result = await global.testSetup.scripts.build();

      expect(result.code).toEqual(0);
      expect(result.stdout).toMatch('Compiled successfully.');
    });
  });
});
