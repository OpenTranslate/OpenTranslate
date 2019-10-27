# @opentranslate/languages

[![npm-version](https://img.shields.io/npm/v/@opentranslate/languages.svg)](https://www.npmjs.com/package/@opentranslate/languages)
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)

Shared language identifiers and locales for [OpenTranslate](https://github.com/OpenTranslate) projects.

## Usage

### Install

Yarn

```
yarn add @opentranslate/languages
```

NPM

```
npm i @opentranslate/languages
```

### Import

CommonJS

```js
const { languages } = require("@opentranslate/languages");
const en = require("@opentranslate/languages/locales/en");
const zhCN = require("@opentranslate/languages/locales/zh-CN");
const zhTW = require("@opentranslate/languages/locales/zh-TW");
```

TypeScript (with `resolveJsonModule` enabled)

```ts
import { languages } from "@opentranslate/languages";
import en from "@opentranslate/languages/locales/en.json";
import zhCN from "@opentranslate/languages/locales/zh-CN.json";
import zhTW from "@opentranslate/languages/locales/zh-TW.json";
```

### API

```ts
const langCode = languages[0];
console.log(langCode); //af
console.log(zhCN[langCode]); //南非荷兰语
console.log(en["en"]); //English
```
