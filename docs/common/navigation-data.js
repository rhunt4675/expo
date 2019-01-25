// @preval

const path = require('path');
const fm = require('front-matter');
const fs = require('fs-extra');

const DIR_MAPPING = {
  introduction: 'Introduction',
  guides: 'Guides',
  tutorials: 'Tutorials',
  sdk: 'SDK API Reference',
  'react-native': 'React Native',
  // "react-native-apis": 'React Native APIs',
  // 'react-native-components': 'React Native Components',
  // 'react-native-guides': 'React Native Guides',
  // 'react-native-basics': 'React Native Basics',
  workflow: 'Working with Expo',
  distribution: 'Distributing Your App',
  expokit: 'ExpoKit',
};

const generateNavLinks = (path_, arr) => {
  let items = fs.readdirSync(path_);

  let processUrl = path => {
    let newPath = path.replace(/^versions/, '/versions').replace(/.md$/, '');
    return newPath;
  };

  for (var i = 0; i < items.length; i++) {
    const filePath = path.join(path_, items[i]);
    if (fs.statSync(filePath).isDirectory()) {
      const { name } = path.parse(filePath);
      let initArr = [];

      // Make sure to add '/' at the end of index pages so that relative links in the markdown work correctly
      let href = fs.existsSync(path.join(filePath, 'index.md')) ? processUrl(filePath) + '/' : '';

      // 'Introduction' section has a 'Quick Start' page that's actually at the root i.e. `/versions/v25.0/`, etc.
      if (name === 'introduction') {
        // TODO: find what's eating the final slash
        initArr.push({ name: 'Quick Start', href: path.parse(href).dir + '//' });
      }
      // 'SDK' section has a 'Introduction' page that's the same as the index page
      if (name === 'sdk') {
        initArr.push({ name: 'Introduction', href });
      }

      arr.push({
        name: DIR_MAPPING[name.toLowerCase()],
        href,
        posts: generateNavLinks(filePath, initArr),
      });
    } else {
      const { ext, name } = path.parse(filePath);
      // Only process markdown files that are not index pages
      if (ext === '.md' && name !== 'index') {
        try {
          let title = fm(fs.readFileSync(filePath, 'utf8')).attributes.title;
          let obj = {
            name: title,
            href: processUrl(filePath),
          };
          arr.push(obj);
        } catch (e) {
          console.log(`Error reading frontmatter of ${filePath}`, e);
        }
      }
    }
  }

  return arr;
};

const ORIGINAL_PATH_PREFIX = './versions';

let versionDirectories = fs
  .readdirSync(ORIGINAL_PATH_PREFIX, { withFileTypes: true })
  .filter(f => f.isDirectory())
  .map(f => f.name);

module.exports = versionDirectories.reduce(
  (obj, version) => ({
    ...obj,
    [version]: generateNavLinks(`${ORIGINAL_PATH_PREFIX}/${version}`, []),
  }),
  {}
);
