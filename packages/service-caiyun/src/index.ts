/* eslint-disable @typescript-eslint/camelcase */
import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError
} from "@opentranslate/translator";
import qs from "qs";

type CaiyunTranslateResult = {
  confidence: number;
  target: string[];
  rc: number;
};

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh"],
  ["en", "en"],
  ["ja", "ja"]
];

export interface CaiyunConfig {
  token: string;
}

export class Caiyun extends Translator<CaiyunConfig> {
  readonly name = "caiyun";

  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Caiyun.langMap.keys()];
  }

  async textToSpeech(text: string, lang: Language): Promise<string> {
    return `http://tts.baidu.com/text2audio?${qs.stringify({
      lan: Caiyun.langMap.get(lang !== "auto" ? lang : "zh-CN") || "zh",
      ie: "UTF-8",
      spd: 5,
      text
    })}`;
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: CaiyunConfig
  ): Promise<TranslateQueryResult> {
    const detect = from === "auto";
    const source = text.split(/\n+/);
    const response = await this.request<CaiyunTranslateResult>(
      "https://api.interpreter.caiyunai.com/v1/translator",
      {
        headers: {
          "content-type": "application/json",
          "x-authorization": "token " + config.token
        },
        method: "POST",
        data: JSON.stringify({
          source,
          trans_type: `${Caiyun.langMap.get(from)}2${Caiyun.langMap.get(to)}`,
          detect
        })
      }
    ).catch(() => {});
    if (!response || !response.data) {
      throw new TranslateError("NETWORK_ERROR");
    }
    const result = response.data;
    return {
      text: text,
      from: detect ? await this.detect(text) : from,
      to,
      origin: {
        paragraphs: source,
        tts: await this.textToSpeech(text, from)
      },
      trans: {
        paragraphs: result.target,
        tts: await this.textToSpeech(result.target.join(" "), to)
      }
    };
  }
}

export default Caiyun;
