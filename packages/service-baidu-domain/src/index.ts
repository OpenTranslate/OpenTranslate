import {
  Language,
  Translator,
  TranslateError,
  TranslateQueryResult
} from "@opentranslate/translator";
import md5 from "md5";
import qs from "qs";

// 百度垂直领域翻译
export const domains = ["medicine", "electronics", "mechanics"];
export type Domain = typeof domains[number];

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh"],
  ["en", "en"]
];

export interface BaiduDomainConfig {
  appid: string;
  key: string;
  domain: Domain;
}

export class BaiduDomain extends Translator<BaiduDomainConfig> {
  readonly name = "baidu-domain";

  readonly endpoint =
    "https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate";

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: BaiduDomainConfig
  ): Promise<TranslateQueryResult> {
    type BaiduDomainTranslateError = {
      error_code: "54001" | string;
      error_msg: "Invalid Sign" | string;
    };

    type BaiduDomainTranslateResult = {
      from: string;
      to: string;
      trans_result: Array<{
        dst: string;
        src: string;
      }>;
    };

    const salt = Date.now();
    const { endpoint } = this;
    const { appid, key, domain } = config;

    const res = await this.request<
      BaiduDomainTranslateResult | BaiduDomainTranslateError
    >(endpoint, {
      params: {
        from: BaiduDomain.langMap.get(from),
        to: BaiduDomain.langMap.get(to),
        q: text,
        salt,
        appid,
        domain,
        sign: md5(appid + text + salt + domain + key)
      }
    }).catch(() => {
      throw new TranslateError("NETWORK_ERROR");
    });

    const { data } = res;

    if ((data as BaiduDomainTranslateError).error_code) {
      console.error(
        new Error(
          "[BaiduDomain service]" +
            (data as BaiduDomainTranslateError).error_msg
        )
      );
      throw new TranslateError("API_SERVER_ERROR");
    }

    const {
      trans_result: transResult,
      from: langDetected
    } = data as BaiduDomainTranslateResult;
    const detectedFrom = BaiduDomain.langMapReverse.get(
      langDetected
    ) as Language;
    const transParagraphs = transResult.map(({ dst }) => dst);

    return {
      text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: transResult.map(({ src }) => src),
        tts: await this.textToSpeech(text, detectedFrom)
      },
      trans: {
        paragraphs: transParagraphs,
        tts: await this.textToSpeech(transParagraphs.join(" "), to)
      }
    };
  }

  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...BaiduDomain.langMap.keys()];
  }

  async textToSpeech(text: string, lang: Language): Promise<string> {
    return `http://tts.baidu.com/text2audio?${qs.stringify({
      lan: BaiduDomain.langMap.get(lang !== "auto" ? lang : "zh-CN") || "zh",
      ie: "UTF-8",
      spd: 5,
      text
    })}`;
  }
}

export default BaiduDomain;
