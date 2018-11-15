const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');
const execa = require('execa');
const globby = require('globby');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('./utils/publishMonorepo');

const shouldInstallScripts = !!process.env.TEAMCITY_VERSION;

const cleanup = shouldInstallScripts ? publishMonorepo() : () => {};

const projects = globby.sync('test/*', {
  onlyDirectories: true,
  absolute: true,
});

projects.forEach(templateDirectory => {
  const rootDirectory = tempy.directory();

  const testDirectory = path.join(rootDirectory, 'project');

  fs.copySync(templateDirectory, testDirectory);

  // Symlink modules locally for faster feedback
  if (!shouldInstallScripts) {
    fs.ensureSymlinkSync(
      path.join(__dirname, '../packages/yoshi/node_modules'),
      path.join(rootDirectory, 'node_modules'),
    );

    fs.ensureSymlinkSync(
      path.join(__dirname, '../packages/yoshi/bin/yoshi.js'),
      path.join(rootDirectory, 'node_modules/.bin/yoshi'),
    );
  } else {
    // Publish the entire monorepo and install everything from CI to get
    // the maximum reliability
    authenticateToRegistry(testDirectory);

    execa.shellSync('npm install', {
      cwd: testDirectory,
      stdio: 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }

  // Copy mocked `node_modules`
  fs.copySync(
    path.join(templateDirectory, '__node_modules__'),
    path.join(testDirectory, 'node_modules'),
  );

  const options = {
    stdio: 'inherit',
    env: { ...process.env, TEST_DIRECTORY: testDirectory },
  };

  const configs = globby.sync(path.join(templateDirectory, 'jest.*.config.js'));

  try {
    configs.forEach(configPath => {
      execa.shellSync(
        `npx jest --config='${configPath}' --no-cache --runInBand`,
        options,
      );
    });
  } finally {
    fs.removeSync(rootDirectory);
  }
});

cleanup();
