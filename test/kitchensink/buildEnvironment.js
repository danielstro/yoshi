const PuppeteerEnvironment = require('jest-environment-puppeteer');

module.exports = class BuildEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    this.global.scripts = global.scripts;

    await this.global.page.setRequestInterception(true);

    this.global.page.on('request', request => {
      const url = request.url();

      if (
        url.startsWith(
          'https://static.parastorage.com/services/kitchensink/1.0.0',
        )
      ) {
        request.continue({
          url: url.replace(
            'https://static.parastorage.com/services/kitchensink/1.0.0',
            'http://localhost:3200',
          ),
        });
      } else {
        request.continue();
      }
    });
  }
};
