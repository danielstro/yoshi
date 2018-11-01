const os = require('os');
const execa = require('execa');
const stripAnsi = require('strip-ansi');
const waitPort = require('wait-port');
const psTree = require('ps-tree');

function waitForPort(port) {
  return waitPort({ port, timeout: 5000, output: 'silent' });
}

function killProcessAndChildren(child) {
  return new Promise(resolve => {
    const { pid } = child;

    psTree(pid, (err, children) => {
      [pid].concat(children.map(p => p.PID)).forEach(tpid => {
        try {
          process.kill(tpid, 'SIGKILL');
        } catch (e) {}
      });

      child = null;
      resolve();
    });
  });
}

function stripYarn(output) {
  let lines = output.split('\n');

  const runIndex = lines.findIndex(line => line.match(/^yarn run/));

  if (runIndex !== -1) {
    lines.splice(0, runIndex + 2);
    lines = lines.filter(line => !line.match(/^info Visit.*yarnpkg/));
  }

  return lines.join('\n');
}

function execaSafe(...args) {
  return execa(...args)
    .then(({ stdout, stderr, ...rest }) => ({
      fulfilled: true,
      rejected: false,
      stdout: stripYarn(stripAnsi(stdout)),
      stderr: stripYarn(stripAnsi(stderr)),
      ...rest,
    }))
    .catch(err => ({
      fulfilled: false,
      rejected: true,
      reason: err,
      stdout: '',
      stderr: stripYarn(
        stripAnsi(
          err.message
            .split(os.EOL)
            .slice(2)
            .join(os.EOL),
        ),
      ),
    }));
}

module.exports = class Scripts {
  constructor(root) {
    this.root = root;
  }

  async start({ env = {} } = {}) {
    const port = 3000;

    const startProcess = execa('npx', ['yoshi', 'start'], {
      cwd: this.root,
      // stdio: 'inherit',
      env: {
        CI: 'false',
        FORCE_COLOR: '0',
        BROWSER: 'none',
        PORT: port,
        ...env,
      },
    });

    await Promise.race([waitForPort(port), startProcess]);

    return {
      port,
      done() {
        return killProcessAndChildren(startProcess);
      },
    };
  }

  async build({ env = {} } = {}) {
    return execaSafe('npx', ['yoshi', 'build'], {
      cwd: this.root,
      env: { CI: 'false', FORCE_COLOR: '0', ...env },
    });
  }

  async serve() {
    const staticsServerPort = 3200;
    const appServerProcessPort = 3000;

    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.root,
        // stdio: 'inherit',
      },
    );

    const appServerProcess = execa('node', ['index.js'], {
      cwd: this.root,
      // stdio: 'inherit',
      env: {
        PORT: appServerProcessPort,
      },
    });

    await waitForPort(staticsServerPort);
    await waitForPort(appServerProcessPort);

    return {
      staticsServerPort,
      appServerProcessPort,
      done() {
        killProcessAndChildren(staticsServerProcess);
        killProcessAndChildren(appServerProcess);
      },
    };
  }
};
