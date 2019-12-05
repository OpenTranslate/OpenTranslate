import React, { useState } from "react";
import ReactDOM from "react-dom";
import en from "@opentranslate/languages/locales/en.json";
import zhCN from "@opentranslate/languages/locales/zh-CN.json";
import zhTW from "@opentranslate/languages/locales/zh-TW.json";
import { TranslateResult, Language } from "@opentranslate/translator";

import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import "./style.css";
import { Speaker } from "./Speaker";

const locales = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW
};

const translatorReq = require.context(
  "../../../../packages/",
  true,
  /service-.*index\.ts$/,
  "sync"
);

function App() {
  const [locale, setLocale] = useState<keyof typeof locales>("zh-CN");
  const [from, setFrom] = useState<Language>("auto");
  const [to, setTo] = useState<Language>("zh-CN");
  const [text, setText] = useState("I love you.");

  const [services, updateServices] = useState<
    Array<{ name: string; loading?: boolean; result?: TranslateResult }>
  >(() =>
    translatorReq.keys().map(path => ({
      name: /service-([^/\\]+)/.exec(path)![1],
      loading: false
    }))
  );

  return (
    <div className="root-columns columns is-marginless">
      <div className="column is-paddingless">
        <div className="section">
          <div className="field">
            <label className="label">Locale</label>
            <div className="control">
              <div className="select">
                <select
                  value={locale}
                  onChange={e =>
                    setLocale(e.currentTarget.value as keyof typeof locales)
                  }
                >
                  <option value="zh-CN">{locales["zh-CN"]["zh-CN"]}</option>
                  <option value="en">{locales["en"]["en"]}</option>
                  <option value="zh-TW">{locales["zh-TW"]["zh-TW"]}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field  is-grouped">
            <div className="control">
              <label className="label">From</label>
              <div className="control">
                <div className="select">
                  <select
                    value={from}
                    onChange={e => setFrom(e.currentTarget.value as Language)}
                  >
                    {Object.keys(en).map(lang => (
                      <option key={lang} value={lang}>
                        {locales[locale][lang as Language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="control">
              <label className="label">To</label>
              <div className="control">
                <div className="select">
                  <select
                    value={to}
                    onChange={e => setTo(e.currentTarget.value as Language)}
                  >
                    {Object.keys(en).map(lang => (
                      <option key={lang} value={lang}>
                        {locales[locale][lang as Language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Text</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="e.g. Hello world"
                value={text}
                onChange={e => setText(e.currentTarget.value)}
              ></textarea>
            </div>
          </div>

          <div className="field">
            <p className="control">
              <button
                className="button is-primary"
                disabled={!text}
                onClick={() => {
                  updateServices(
                    services.map(service => ({
                      name: service.name,
                      loading: true
                    }))
                  );
                  services.forEach(async (service, i) => {
                    let result: undefined | TranslateResult;
                    try {
                      result = await browser.runtime.sendMessage({
                        type: "TRANSLATE",
                        name: service.name,
                        text,
                        from,
                        to
                      });
                    } catch (e) {
                      console.warn(service.name, e);
                    }
                    updateServices(services => {
                      const newServices = services.slice();
                      newServices.splice(i, 1, { name: service.name, result });
                      return newServices;
                    });
                  });
                }}
              >
                Search
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="column is-paddingless">
        <div className="section">
          {services.map((service, i) => {
            return (
              <div
                key={service.name}
                className="box is-paddingless is-shadowless"
              >
                <div className="card">
                  <header className="card-header">
                    <p className="card-header-title">{service.name}</p>
                  </header>
                  <div className="card-content">
                    <div className="content">
                      {service.loading ? (
                        <p>
                          <span className="icon has-text-info">
                            <i className="fas fa-spinner fa-pulse"></i>
                          </span>
                        </p>
                      ) : service.result ? (
                        <>
                          <strong>Origin</strong>
                          {" · "}
                          <small>
                            {locales[locale][service.result.from]}
                          </small>{" "}
                          <Speaker src={service.result.origin.tts} />
                          {service.result.origin.paragraphs.map(line => (
                            <p>{line}</p>
                          ))}
                          <strong>Translation</strong>
                          {" · "}
                          <small>
                            {locales[locale][service.result.to]}
                          </small>{" "}
                          <Speaker src={service.result.trans.tts} />
                          {service.result.trans.paragraphs.map(line => (
                            <p>{line}</p>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
