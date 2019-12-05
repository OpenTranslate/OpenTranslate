import { Translator, TranslatorInit } from "@opentranslate/translator";

const env = require("../env.json");

const translatorReq = require.context(
  "../../../packages/",
  true,
  /service-.*index\.ts$/,
  "sync"
);

const translators = translatorReq
  .keys()
  .reduce<{ [k: string]: Translator }>((o, path) => {
    const Trans: new (init?: TranslatorInit<{}>) => Translator = translatorReq(
      path
    ).default;
    const trans = new Trans({
      env: "ext",
      config: env[/service-([^/\\]+)/.exec(path)![1]]
    });
    o[trans.name] = trans;
    return o;
  }, {});

browser.runtime.onMessage.addListener(message => {
  switch (message.type) {
    case "TRANSLATE":
      return translators[message.name].translate(
        message.text,
        message.from,
        message.to
      );
  }
});
