const http = require('http');

const makeRequest = url => {
  return new Promise(resolve => {
    http.get(url, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => resolve(rawData.replace(/\s/g, '')));
    });
  });
};

const request = url => {
  if (
    url.startsWith('https://static.parastorage.com/services/kitchensink/1.0.0')
  ) {
    return makeRequest(
      url.replace(
        'https://static.parastorage.com/services/kitchensink/1.0.0',
        'http://localhost:3200',
      ),
    );
  }

  return makeRequest(url);
};

const matchCSS = async (chunkName, page, regexes) => {
  const url = await page.$$eval(
    'link',
    (links, name) => {
      return links
        .filter(link => link.rel === 'stylesheet')
        .map(link => link.href)
        .find(href => href.includes(name));
    },
    chunkName,
  );

  const content = await request(url);

  for (const regex of regexes) {
    expect(content).toMatch(regex);
  }
};

const matchJS = async (chunkName, page, regexes) => {
  const url = await page.$$eval(
    'script',
    (scripts, name) => {
      return scripts.map(script => script.src).find(src => src.contains(name));
    },
    chunkName,
  );

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
