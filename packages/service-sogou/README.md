# @opentranslate/sogou

[![npm-version](https://img.shields.io/npm/v/@opentranslate/sogou.svg)](https://www.npmjs.com/package/@opentranslate/sogou)
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)

Sogou translator with [OpenTranslate](https://github.com/OpenTranslate) API.

## Installation

Yarn

```
yarn add @opentranslate/sogou
```

NPM

```
npm i @opentranslate/sogou
```

## Usage

```
import Sogou from '@opentranslate/sogou'
//please refer to https://deepi.sogou.com/?from=translatepc
const sogou = new Sogou(
    config: {
      pid: "your pid",
      key: "your key"
    }
)

sogou.translate('text').then(console.log)
```

## API

See [translator](https://github.com/OpenTranslate/OpenTranslate/blob/master/packages/translator/README.md) for more details.

## Disclaimer

The material and source code from this package are for study and research purposes only. Any reliance you place on such material or source code are strictly at your own risk.
