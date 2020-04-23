# @opentranslate/baidu-domain

[![npm-version](https://img.shields.io/npm/v/@opentranslate/baidu-domain.svg)](https://www.npmjs.com/package/@opentranslate/baidu-domain)
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)

Baidu-domain translator with [OpenTranslate](https://github.com/OpenTranslate) API.

## Installation

Yarn

```
yarn add @opentranslate/baidu-domain
```

NPM

```
npm i @opentranslate/baidu-domain
```

## Usage

```
import BaiduDomain from '@opentranslate/baidu-domain'

//please refer to https://api.fanyi.baidu.com/doc/22 for more details
const baiduDomain = new BaiduDomain({
    config: {
      domain: "medicine", // select from ["medicine", "electronics", "mechanics"]
      key: process.env.KEY as string,
      appid: process.env.APPID as string
    }
  });

baiduDomain.translate("肌萎缩侧索硬化症","zh-CN","en").then(console.log)

```

## API

See [translator](https://github.com/OpenTranslate/OpenTranslate/blob/master/packages/translator/README.md) for more details.

## Disclaimer

The material and source code from this package are for study and research purposes only. Any reliance you place on such material or source code are strictly at your own risk.
