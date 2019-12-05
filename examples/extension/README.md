Examples of running OpenTranslate translators on browser extension.

## Installation

```
git clone git@github.com:OpenTranslate/OpenTranslate.git
cd OpenTranslate/examples/extension
yarn
```

Add `env.json` with config of each translator:

```json
{
  "[id]": {
    "id": "...",
    "key": "...",
    "...": "..."
  },
  "...": "..."
}
```

Build project with `yarn build` and load extension at `OpenTranslate/examples/extension/build`.

Click the browser action icon.

## Disclaimer

The material and source code from this package are for study and research purposes only. Any reliance you place on such material or source code are strictly at your own risk.
