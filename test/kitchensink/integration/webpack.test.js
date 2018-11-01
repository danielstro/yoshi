const { matchCSS, matchJS, initTest } = require('../../utils');

describe('webpack', () => {
  describe('css', () => {
    it('css inclusion', async () => {
      await initTest('css-inclusion');

      const className = await page.$eval('#css-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('css-inclusion', page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('global css inclusion', async () => {
      await initTest('global-css-inclusion');

      await matchCSS('global-css-inclusion', page, [
        /\.global-css-modules-inclusion\{background:.+;color:.+}/,
      ]);
    });

    it('css camelcase inclusion', async () => {
      await initTest('css-camelcase-inclusion');

      const className = await page.$eval('#css-camelcase-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('css-camelcase-inclusion', page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('auto prefixer', async () => {
      await initTest('css-auto-prefixer');

      await matchCSS('css-auto-prefixer', page, [
        /-webkit-appearance:'none';-moz-appearance:'none';appearance:'none';/,
      ]);
    });

    it('css url() uses relative paths', async () => {
      await initTest('css-image-url');

      await matchCSS('css-image-url', page, [
        /background-image:url\(components\/features\/assets\/large-bart-simpson.gif.+\)/,
      ]);
    });
  });

  describe.skip('stylable', () => {
    it('st.css inclusion', async () => {
      await initTest('st-css-inclusion');

      const className = await page.$eval('#st-css-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchJS(page, [new RegExp(`${className}`)]);
    });
  });

  describe('scss', () => {
    it('scss inclusion', async () => {
      await initTest('scss-inclusion');

      const className = await page.$eval('#scss-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('scss-inclusion', page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('global scss inclusion', async () => {
      await initTest('global-scss-inclusion');

      await matchCSS('global-scss-inclusion', page, [
        /\.global-scss-modules-inclusion\{background:.+;color:.+}/,
      ]);
    });
  });

  describe('sass', () => {
    it('sass inclusion', async () => {
      await initTest('sass-inclusion');

      const className = await page.$eval('#sass-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('sass-inclusion', page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('global sass inclusion', async () => {
      await initTest('global-sass-inclusion');

      await matchCSS('global-sass-inclusion', page, [
        /\.global-sass-modules-inclusion\{background:.+;color:.+}/,
      ]);
    });
  });

  describe('less', () => {
    it('less inclusion', async () => {
      await initTest('less-inclusion');

      const className = await page.$eval('#less-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('less-inclusion', page, [
        new RegExp(`.${className}{background:.+;color:.+}`),
      ]);
    });

    it('global less inclusion', async () => {
      await initTest('global-less-inclusion');

      await matchCSS('global-less-inclusion', page, [
        /\.global-less-modules-inclusion\{background:.+;color:.+}/,
      ]);
    });
  });

  describe('markdown', () => {
    it('markdown inclusion', async () => {
      await initTest('markdown-inclusion');

      const innerHTML = await page.$eval(
        '#markdown-inclusion',
        elm => elm.innerHTML,
      );

      expect(innerHTML).toEqual('## Hello World');
    });
  });

  describe('graphql', () => {
    it('graphql inclusion', async () => {
      await initTest('graphql-inclusion');

      const innerHTML = await page.$eval(
        '#graphql-inclusion',
        elm => elm.innerHTML,
      );

      expect(JSON.parse(innerHTML)).toMatchObject({ kind: 'Document' });
    });
  });

  describe('images', () => {
    it('small image inclusion', async () => {
      await initTest('small-image-inclusion');

      const imageSource = await page.$eval(
        '#small-image-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(/^data:image\/jpeg;base64.+==$/);
    });

    it('large image inclusion', async () => {
      await initTest('large-image-inclusion');

      const imageSource = await page.$eval(
        '#large-image-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(
        /^.+components\/features\/assets\/large-bart-simpson.gif.+$/,
      );
    });

    it('inline svg inclusion', async () => {
      await initTest('inline-svg-inclusion');

      const imageSource = await page.$eval(
        '#inline-svg-inclusion',
        elm => elm.src,
      );

      expect(imageSource).toMatch(/svg/);
    });
  });

  describe('json', () => {
    it('json inclusion', async () => {
      await initTest('json-inclusion');

      const result = await page.$eval(
        '#json-inclusion',
        elm => elm.textContent,
      );

      expect(result).toBe('This is an abstract.');
    });
  });
});