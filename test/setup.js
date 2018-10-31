const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const ReactScripts = require('./scripts');

module.exports = class TestSetup {
  constructor(fixtureName, templateDirectory) {
    this.fixtureName = fixtureName;

    this.templateDirectory = templateDirectory;
    this.testDirectory = null;
    this._scripts = null;

    this.setup = this.setup.bind(this);
    this.teardown = this.teardown.bind(this);

    this.isLocal = !(process.env.CI && process.env.CI !== 'false');
  }

  async setup() {
    await this.teardown();

    this.testDirectory = tempy.directory();

    console.log(this.testDirectory);

    await fs.copy(this.templateDirectory, this.testDirectory);

    const shouldInstallScripts = !this.isLocal;

    if (!shouldInstallScripts) {
      await fs.ensureSymlink(
        path.resolve(
          path.resolve(__dirname, '..', 'packages', 'yoshi', 'node_modules'),
        ),
        path.join(this.testDirectory, 'node_modules'),
      );

      await fs.ensureSymlink(
        path.resolve(
          path.resolve(
            __dirname,
            '../../..',
            'packages',
            'yoshi',
            'bin',
            'yoshi.js',
          ),
        ),
        path.join(this.testDirectory, 'node_modules', '.bin', 'yoshi'),
      );
    }
  }

  get scripts() {
    if (this.testDirectory == null) {
      return null;
    }

    if (this._scripts == null) {
      this._scripts = new ReactScripts(this.testDirectory);
    }

    return this._scripts;
  }

  async teardown() {
    if (this.testDirectory != null) {
      // await fs.remove(this.testDirectory);

      this.testDirectory = null;
      this._scripts = null;
    }
  }
};
