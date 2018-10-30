const path = require('path');
const TestSetup = require('./setup');

const fixturePath = path.join(path.dirname(module.parent.filename), '..');
const fixtureName = path.basename(fixturePath);

const testSetup = new TestSetup(fixtureName, fixturePath);

beforeAll(async () => {
  await testSetup.setup();
}, 1000 * 60 * 5);

afterAll(async () => {
  await testSetup.teardown();
});

module.exports = testSetup;
