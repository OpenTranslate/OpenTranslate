# @opentranslate/youdao

[![npm-version](https://img.shields.io/npm/v/@opentranslate/youdao.svg)](https://www.npmjs.com/package/@opentranslate/youdao)
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)

Youdao translator with [OpenTranslate](https://github.com/OpenTranslate) API.

## Installation

Yarn

```
yarn add @opentranslate/youdao
```

NPM

```
npm i @opentranslate/youdao
```

## Usage

```
import Youdao from '@opentranslate/youdao'
//please visit http://ai.youdao.com/gw.s for more information.
const youdao = new Youdao(config: {
    appKey: "your appKey",
    key: "your Key"
})

youdao.translate('text').then(console.log)
```

## API

See [translator](https://github.com/OpenTranslate/OpenTranslate/blob/master/packages/translator/README.md) for more details.

## Disclaimer

The material and source code from this package are for study and research purposes only. Any reliance you place on such material or source code are strictly at your own risk.
