const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const Scripts = require('./scripts');

module.exports = class TestSetup {
  constructor(templateDirectory) {
    this.templateDirectory = templateDirectory;
    this.testDirectory = null;
    this._scripts = null;

    this.isCI = !!process.env.TEAMCITY_VERSION;
  }

  async setup() {
    await this.teardown();

    this.testDirectory = tempy.directory();

    await fs.copy(this.templateDirectory, this.testDirectory);

    const shouldInstallScripts = this.isCI;

    // Symlink modules locally for faster feedback
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
    } else {
      // Publish the entire monorepo and install everything from CI to get
      // the maximum reliability
    }
  }

  get scripts() {
    if (this.testDirectory == null) {
      return null;
    }

    if (this._scripts == null) {
      this._scripts = new Scripts(this.testDirectory);
    }

    return this._scripts;
  }

  async teardown() {
    if (this.testDirectory != null) {
      await fs.remove(this.testDirectory);

      this.testDirectory = null;
      this._scripts = null;
    }
  }
};
