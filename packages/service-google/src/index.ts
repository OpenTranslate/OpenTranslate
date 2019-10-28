import {
  Language,
  Translator,
  TranslateQueryResult
} from "@opentranslate/translator";
import qs from "qs";

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh-CN"],
  ["zh-TW", "zh-TW"],
  ["en", "en"],
  ["af", "af"],
  ["am", "am"],
  ["ar", "ar"],
  ["az", "az"],
  ["be", "be"],
  ["bg", "bg"],
  ["bn", "bn"],
  ["bs", "bs"],
  ["ca", "ca"],
  ["ceb", "ceb"],
  ["co", "co"],
  ["cs", "cs"],
  ["cy", "cy"],
  ["da", "da"],
  ["de", "de"],
  ["el", "el"],
  ["eo", "eo"],
  ["es", "es"],
  ["et", "et"],
  ["eu", "eu"],
  ["fa", "fa"],
  ["fi", "fi"],
  ["fr", "fr"],
  ["fy", "fy"],
  ["ga", "ga"],
  ["gd", "gd"],
  ["gl", "gl"],
  ["gu", "gu"],
  ["ha", "ha"],
  ["haw", "haw"],
  ["he", "he"],
  ["hi", "hi"],
  ["hmn", "hmn"],
  ["hr", "hr"],
  ["ht", "ht"],
  ["hu", "hu"],
  ["hy", "hy"],
  ["id", "id"],
  ["ig", "ig"],
  ["is", "is"],
  ["it", "it"],
  ["ja", "ja"],
  ["jw", "jw"],
  ["ka", "ka"],
  ["kk", "kk"],
  ["km", "km"],
  ["kn", "kn"],
  ["ko", "ko"],
  ["ku", "ku"],
  ["ky", "ky"],
  ["la", "la"],
  ["lb", "lb"],
  ["lo", "lo"],
  ["lt", "lt"],
  ["lv", "lv"],
  ["mg", "mg"],
  ["mi", "mi"],
  ["mk", "mk"],
  ["ml", "ml"],
  ["mn", "mn"],
  ["mr", "mr"],
  ["ms", "ms"],
  ["mt", "mt"],
  ["my", "my"],
  ["ne", "ne"],
  ["nl", "nl"],
  ["no", "no"],
  ["ny", "ny"],
  ["pa", "pa"],
  ["pl", "pl"],
  ["ps", "ps"],
  ["pt", "pt"],
  ["ro", "ro"],
  ["ru", "ru"],
  ["sd", "sd"],
  ["si", "si"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["sm", "sm"],
  ["sn", "sn"],
  ["so", "so"],
  ["sq", "sq"],
  ["sr", "sr"],
  ["st", "st"],
  ["su", "su"],
  ["sv", "sv"],
  ["sw", "sw"],
  ["ta", "ta"],
  ["te", "te"],
  ["tg", "tg"],
  ["th", "th"],
  ["fil", "tl"],
  ["tr", "tr"],
  ["uk", "uk"],
  ["ur", "ur"],
  ["uz", "uz"],
  ["vi", "vi"],
  ["xh", "xh"],
  ["yi", "yi"],
  ["yo", "yo"],
  ["zu", "zu"]
];

export interface GoogleConfig {
  token: string;
  /** @deprecated */
  order?: Array<"cn" | "com" | "api">;
  /** @deprecated */
  concurrent?: boolean;
  /** @deprecated */
  apiAsFallback?: boolean;
}

export class Google extends Translator<GoogleConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  config: GoogleConfig = {
    token: "",
    order: ["cn", "com"],
    concurrent: true,
    apiAsFallback: true
  };

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: GoogleConfig
  ): Promise<TranslateQueryResult> {
    const { data: result } = await this.axios.get<[string[], null, string]>(
      "https://translate.googleapis.com/translate_a/single?" +
        qs.stringify({
          client: "gtx",
          dt: "t",
          sl: from,
          tl: to,
          q: text,
          tk: config.token
        })
    );

    if (!result) {
      throw new Error("NETWORK_ERROR");
    }

    if (!result[0] || result[0].length <= 0) {
      throw new Error("API_SERVER_ERROR");
    }

    const transParagraphs = result[0].map(item => item[0]).filter(Boolean);

    return {
      text: text,
      from: Google.langMapReverse.get(result[2]) || "auto",
      to,
      origin: {
        paragraphs: text.split(/\n+/)
      },
      trans: {
        paragraphs: transParagraphs
      }
    };
  }

  readonly name = "google";

  getSupportLanguages(): Language[] {
    return [...Google.langMap.keys()];
  }

  async detect(text: string): Promise<Language> {
    try {
      return (await this.translate(text, "auto", "zh-CN")).from;
    } catch (e) {
      return "auto";
    }
  }
}

export default Google;
