const http = require('http');

const request = url => {
  return new Promise(resolve => {
    http.get(url, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => resolve(rawData.replace(/\s/g, '')));
    });
  });
};

const matchCSS = async (page, regexes) => {
  const url = await page.$$eval('link', links => {
    let href = '';

    for (const link of links) {
      if (link.rel === 'stylesheet') {
        href = link.href;
      }
    }

    return href;
  });

  const content = await request(url);

  for (const regex of regexes) {
    expect(content).toMatch(regex);
  }
};

const matchJS = async (page, regexes) => {
  const url = await page.$$eval('script', scripts => {
    let src = '';

    for (const link of scripts) {
      src = link.src;
    }

    return src;
  });

  const content = await request(url);

  for (const regex of regexes) {
    expect(content).toMatch(regex);
  }
};

const initTest = async feature => {
  await page.goto(`http://localhost:3000#${feature}`);
  await page.reload();
};

module.exports = { request, matchJS, matchCSS, initTest };
