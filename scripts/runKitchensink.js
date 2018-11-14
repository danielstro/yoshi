const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');
const execa = require('execa');
const globby = require('globby');

const stdio = /* verbose */ true ? 'inherit' : 'pipe';

const shouldInstallScripts = !!process.env.TEAMCITY_VERSION;

const testRegistry = 'http://localhost:4873';

const publishMonorepo = () => {
  // Start in root directory even if run from another directory
  process.chdir(path.join(__dirname, '..'));

  const verdaccio = execa.shell('npx verdaccio --config verdaccio.yaml', {
    stdio,
  });

  execa.shellSync('npx wait-port 4873 -o silent', {
    stdio,
  });

  execa.shellSync(
    `npx lerna exec 'npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"'`,
    {
      stdio,
    },
  );

  execa.shellSync(
    `npx lerna exec 'node ../../packages/create-yoshi-app/scripts/verifyPublishConfig.js'`,
    {
      stdio,
    },
  );

  execa.shellSync(
    `npx lerna publish --yes --force-publish=* --skip-git --cd-version=minor --exact --npm-tag=latest --registry="${testRegistry}"`,
    {
      stdio: 'inherit',
    },
  );

  // Return a cleanup function
  return () => {
    execa.shellSync(`kill -9 ${verdaccio.pid}`);
  };
};

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
      path.join(__dirname, '..', 'packages', 'yoshi', 'node_modules'),
      path.join(rootDirectory, 'node_modules'),
    );

    fs.ensureSymlinkSync(
      path.join(__dirname, '..', 'packages', 'yoshi', 'bin', 'yoshi.js'),
      path.join(rootDirectory, 'node_modules', '.bin', 'yoshi'),
    );
  } else {
    // Publish the entire monorepo and install everything from CI to get
    // the maximum reliability
    execa.shellSync(
      `npx npm-auth-to-token -u user -p password -e user@example.com -r "http://localhost:4873"`,
      { cwd: testDirectory },
    );

    execa.shellSync('npm install', {
      cwd: testDirectory,
      stdio: 'inherit',
    });
  }

  // Copy mocked `node_modules`
  fs.copySync(
    path.join(templateDirectory, '__node_modules__'),
    path.join(testDirectory, 'node_modules'),
  );

  const options = {
    stdio,
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
