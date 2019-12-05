import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError
} from "@opentranslate/translator";
import md5 from "md5";
import qs from "qs";

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh-CHS"],
  ["zh-TW", "zh-CHT"],
  ["en", "en"],
  ["af", "af"],
  ["ar", "ar"],
  ["bg", "bg"],
  ["bn", "bn"],
  ["bs", "bs-Latn"],
  ["ca", "ca"],
  ["cs", "cs"],
  ["cy", "cy"],
  ["da", "da"],
  ["de", "de"],
  ["el", "el"],
  ["es", "es"],
  ["et", "et"],
  ["fa", "fa"],
  ["fi", "fi"],
  ["fil", "fil"],
  ["fj", "fj"],
  ["fr", "fr"],
  ["he", "he"],
  ["hi", "hi"],
  ["hr", "hr"],
  ["ht", "ht"],
  ["hu", "hu"],
  ["id", "id"],
  ["it", "it"],
  ["ja", "ja"],
  ["ko", "ko"],
  ["lt", "lt"],
  ["lv", "lv"],
  ["mg", "mg"],
  ["ms", "ms"],
  ["mt", "mt"],
  ["mww", "mww"],
  ["nl", "nl"],
  ["no", "no"],
  ["otq", "otq"],
  ["pl", "pl"],
  ["pt", "pt"],
  ["ro", "ro"],
  ["ru", "ru"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["sm", "sm"],
  ["sr-Cyrl", "sr-Cyrl"],
  ["sr-Latn", "sr-Latn"],
  ["sv", "sv"],
  ["sw", "sw"],
  ["th", "th"],
  ["tlh", "tlh"],
  ["tlh-Qaak", "tlh-Qaak"],
  ["to", "to"],
  ["tr", "tr"],
  ["ty", "ty"],
  ["uk", "uk"],
  ["ur", "ur"],
  ["vi", "vi"],
  ["yua", "yua"],
  ["yue", "yue"]
];

export interface SogouConfig {
  pid: string;
  key: string;
}
interface SogouResult {
  query: string;
  translation: string;
  errorCode: string;
  detect: string;
}

export class Sogou extends Translator<SogouConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);
  private static readonly salt = "1508404016012";

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: SogouConfig
  ): Promise<TranslateQueryResult> {
    const sign = md5(config.pid + text + Sogou.salt + config.key);
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json"
    };
    const res = await this.request<SogouResult>(
      "http://fanyi.sogou.com/reventondc/api/sogouTranslate",
      {
        method: "post",
        data: qs.stringify({
          from: Sogou.langMap.get(from),
          to: Sogou.langMap.get(to),
          pid: config.pid,
          q: text,
          sign: sign,
          salt: Sogou.salt
        }),
        headers
      }
    ).catch(() => {
      throw new TranslateError("NETWORK_ERROR");
    });
    const result = res.data;
    return {
      text,
      from: Sogou.langMapReverse.get(result.detect) || "auto",
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: (await this.textToSpeech(text, from)) || ""
      },
      trans: {
        paragraphs: [result.translation],
        tts: (await this.textToSpeech(result.translation, to)) || ""
      }
    };
  }

  readonly name = "sogou";

  getSupportLanguages(): Language[] {
    return [...Sogou.langMap.keys()];
  }

  async detect(text: string): Promise<Language> {
    const result = await this.translate(text, "auto", "en");
    return result.from;
  }

  async textToSpeech(text: string, lang: Language): Promise<string | null> {
    return lang === "zh-TW"
      ? `https://fanyi.sogou.com/reventondc/microsoftGetSpeakFile?${qs.stringify(
          {
            text,
            spokenDialect: "zh-CHT",
            from: "translateweb"
          }
        )}`
      : `https://fanyi.sogou.com/reventondc/synthesis?${qs.stringify({
          text,
          speed: "1",
          lang: Sogou.langMap.get(lang) || "en",
          from: "translateweb"
        })}`;
  }
}

export default Sogou;
