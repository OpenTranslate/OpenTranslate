import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError
} from "@opentranslate/translator";
import qs from "qs";

const langMap: [Language, string][] = [
  ["auto", ""],
  ["zh-CN", "ZH"],
  ["zh-TW", "ZH"],
  ["en", "EN"],
  ["de", "DE"],
  ["fr", "FR"],
  ["it", "IT"],
  ["ja", "JA"],
  ["es", "ES"],
  ["nl", "NL"],
  ["pl", "PL"],
  ["pt", "PT"],
  ["ru", "RU"]
];

export interface DeeplConfig {
  auth_key: string;
  /**
   * Sets whether the translation engine should first split the input into sentences.
   * This is enabled by default. Possible values are:
   *
   * - "0" - no splitting at all, whole input is treated as one sentence
   * - "1" (default) - splits on interpunction and on newlines
   * - "nonewlines" - splits on interpunction only, ignoring newlines
   *
   * For applications that send one sentence per text parameter,
   * it is advisable to set split_sentences=0,
   * in order to prevent the engine from splitting the sentence unintentionally.
   */
  split_sentences?: "0" | "1" | "nonewlines";
  /**
   * Sets whether the translation engine should respect the original formatting,
   * even if it would usually correct some aspects. Possible values are:
   *
   * - "0" (default)
   * - "1"
   *
   * The formatting aspects affected by this setting include:
   * - Punctuation at the beginning and end of the sentence
   * - Upper/lower case at the beginning of the sentence
   */
  preserve_formatting?: "0" | "1";
  /**
   * Sets whether the translated text should lean towards formal or informal language.
   * This feature currently works for all target languages
   * except "EN" (English), "EN-GB" (British English), "EN-US" (American English), "ES" (Spanish), "JA" (Japanese) and "ZH" (Chinese).
   * Possible options are:
   *
   * - "default" (default)
   * - "more" - for a more formal language
   * - "less" - for a more informal language
   */
  formality?: "default" | "more" | "less";
  /**
   * Sets which kind of tags should be handled. Options currently available:
   * - "xml"
   */
  tag_handling?: string[];
  /** Comma-separated list of XML tags which never split sentences. */
  non_splitting_tags?: string[];
  /** Please see the "Handling XML" section for further details. */
  outline_detection?: string;
  /** Comma-separated list of XML tags which always cause splits. */
  splitting_tags?: string[];
  /** Comma-separated list of XML tags that indicate text not to be translated. */
  ignore_tags?: string[];
}

interface DeeplResult {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export class Deepl extends Translator<DeeplConfig> {
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
    config: DeeplConfig
  ): Promise<TranslateQueryResult> {
    const response = await this.request<DeeplResult>(
      "https://api.deepl.com/v2/translate",
      {
        method: "post",
        data: qs.stringify({
          ...config,
          ["source_lang"]: Deepl.langMap.get(from),
          ["target_lang"]: Deepl.langMap.get(to)
        })
      }
    ).catch(() => {});

    if (!response || !response.data) {
      throw new TranslateError("NETWORK_ERROR");
    }

    const { translations } = response.data;

    return {
      text: text,
      from:
        (translations[0] &&
          Deepl.langMapReverse.get(translations[0].detected_source_language)) ||
        from,
      to,
      origin: { paragraphs: text.split(/\n+/) },
      trans: { paragraphs: translations.map(t => t.text) }
    };
  }

  readonly name = "deepl";

  getSupportLanguages(): Language[] {
    return [...Deepl.langMap.keys()];
  }

  // async detect(text: string): Promise<Language> {
  // }

  // async textToSpeech(text: string, lang: Language): Promise<string | null> {
  // }
}

export default Deepl;
