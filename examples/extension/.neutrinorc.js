const path = require("path");
const react = require("@neutrinojs/react");
const wext = require("neutrino-webextension");

module.exports = {
  options: {
    mains: {
      example: {
        entry: "example",
        webext: {
          type: "page"
        }
      },
      popup: {
        entry: "popup",
        webext: {
          type: "browser_action"
        }
      },
      background: {
        entry: "background",
        webext: {
          type: "background"
        }
      }
    }
  },
  use: [
    react({
      babel: {
        presets: [
          [
            "@babel/preset-typescript",
            {
              isTSX: true,
              allExtensions: true
            }
          ]
        ]
      }
    }),
    neutrino => {
      /* eslint-disable indent */
      // prettier-ignore
      neutrino.config
        .performance
          .hints(false)
          .end()
        .optimization
          .clear()
          .end()
        .module
          .rule('compile') // add ts extensions for babel ect
            .test(/\.(mjs|jsx|js|ts|tsx)$/)
            .include
              .add(path.join(__dirname, '../../packages'))
              .end()
            .end()
          .end()
        .resolve
          .extensions // typescript extensions
            .add('.ts')
            .add('.tsx')
            .end()
          .alias // '@' src alias
            .set('@', path.join(__dirname, 'src'))
            .end()
          .end()
      /* eslint-enable indent */
    },
    wext({
      polyfill: true
    })
  ]
};
