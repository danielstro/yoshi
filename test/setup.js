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

    this.rootDirectory = tempy.directory();

    this.testDirectory = path.join(this.rootDirectory, 'project');

    await fs.copy(this.templateDirectory, this.testDirectory);

    const shouldInstallScripts = this.isCI;

    // Symlink modules locally for faster feedback
    if (true || !shouldInstallScripts) {
      await fs.ensureSymlink(
        path.join(__dirname, '..', 'packages', 'yoshi', 'node_modules'),
        path.join(this.rootDirectory, 'node_modules'),
      );

      await fs.ensureSymlink(
        path.join(__dirname, '..', 'packages', 'yoshi', 'bin', 'yoshi.js'),
        path.join(this.rootDirectory, 'node_modules', '.bin', 'yoshi'),
      );
    } else {
      // Publish the entire monorepo and install everything from CI to get
      // the maximum reliability
    }

    // Copy mocked `node_modules`
    await fs.copy(
      path.join(this.templateDirectory, '__node_modules__'),
      path.join(this.testDirectory, 'node_modules'),
    );
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
    if (this.rootDirectory != null) {
      await fs.remove(this.rootDirectory);

      this.rootDirectory = null;
      this.testDirectory = null;
      this._scripts = null;
    }
  }
};
