# OpenTranslate

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg?maxAge=2592000)](https://conventionalcommits.org)

Building blocks for bridging translation services with unified interface.

## Installation

```bash
git clone git@github.com:OpenTranslate/OpenTranslate.git
cd OpenTranslate
yarn
yarn build
```

## Usage

See `package.json` and [lerna](https://github.com/lerna/lerna) docs for commands.

- Run lerna commands with `yarn lerna <command>`.
  - Create package: `yarn lerna create module-1`.
  - Create translator "google": `yarn create-translator google`.
  - Install `@opentranslate/module-1` for `@opentranslate/module-2`: `yarn lerna add @opentranslate/module-1 packages/module-2`.
- Git-commit with `yarn commit` or [vscode extension](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen).

## Badges
### For library under OpenTranslate Standard.
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)
```markdown
[![OpenTranslate](https://img.shields.io/badge/OpenTranslate-Compatible-brightgreen)](https://github.com/OpenTranslate)
```

### For library/software using OpenTranslate. 
[![OpenTranslate](https://img.shields.io/badge/Powered_by-OpenTranslate-brightgreen)](https://github.com/OpenTranslate)

```markdown
[![OpenTranslate](https://img.shields.io/badge/Powered_by-OpenTranslate-brightgreen)](https://github.com/OpenTranslate)
```


## Disclaimer

The material, source code, and packages from this project are for study and research purposes only. Any reliance you place on such material, source code or packages are strictly at your own risk.
