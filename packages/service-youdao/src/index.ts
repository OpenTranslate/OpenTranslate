import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError
} from "@opentranslate/translator";
import { sha256 } from "js-sha256";
import qs from "qs";

function truncate(q: string): string {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["en", "en"],
  ["ru", "ru"],
  ["pt", "pt"],
  ["es", "es"],
  ["zh-CN", "zh-CHS"],
  ["ja", "ja"],
  ["ko", "ko"],
  ["fr", "fr"],
  ["ar", "ar"],
  ["id", "id"],
  ["vi", "vi"],
  ["it", "it"]
];

export interface YoudaoConfig {
  appKey: string;
  key: string;
}

interface YoudaoTranslateResult {
  errorCode: Language;
  query: string;
  translation: Array<string>;
  l: string;
}

export class Youdao extends Translator<YoudaoConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: YoudaoConfig
  ): Promise<TranslateQueryResult> {
    const salt = new Date().getTime();
    const curTime = Math.round(new Date().getTime() / 1000);
    const str1 = config.appKey + truncate(text) + salt + curTime + config.key;
    const sign = sha256(str1);
    const res = await this.request<YoudaoTranslateResult>(
      "http://openapi.youdao.com/api",
      {
        method: "post",
        data: qs.stringify({
          q: text,
          appKey: config.appKey,
          salt: salt,
          from: Youdao.langMap.get(from),
          to: Youdao.langMap.get(to),
          sign: sign,
          signType: "v3",
          curtime: curTime,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      }
    ).catch(() => {
      throw new TranslateError("NETWORK_ERROR");
    });
    const result = res.data;
    return {
      text,
      from,
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: (await this.textToSpeech(text, from)) || undefined
      },
      trans: {
        paragraphs: result.translation,
        tts:
          (await this.textToSpeech(result.translation.join("\n"), to)) ||
          undefined
      }
    };
  }

  readonly name = "youdao";

  getSupportLanguages(): Language[] {
    return [...Youdao.langMap.keys()];
  }

  async textToSpeech(text: string, lang: Language): Promise<string | null> {
    const standard2custom: { [prop: string]: string | null } = {
      en: "eng",
      ja: "jap",
      ko: "ko",
      fr: "fr"
    };
    const voiceLang = standard2custom[lang];
    if (!voiceLang) return null;

    return (
      "http://tts.youdao.com/fanyivoice?" +
      qs.stringify({
        word: text,
        le: voiceLang,
        keyfrom: "speaker-target"
      })
    );
  }
}

export default Youdao;
