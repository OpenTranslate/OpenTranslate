import {
  Language,
  Translator,
  TranslateQueryResult
} from "@opentranslate/translator";
import SHA256 from "crypto-js/sha256";
import HMACSHA256 from "crypto-js/hmac-sha256";
import EncHEX from "crypto-js/enc-hex";
import { AxiosPromise } from "axios";

const langMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh"],
  ["zh-TW", "zh-TW"],
  ["de", "de"],
  ["en", "en"],
  ["es", "es"],
  ["fr", "fr"],
  ["id", "id"],
  ["it", "it"],
  ["ja", "jp"],
  ["ko", "kr"],
  ["ms", "ms"],
  ["pt", "pt"],
  ["ru", "ru"],
  ["th", "th"],
  ["tr", "tr"],
  ["vi", "vi"]
];

export interface TencentConfig {
  secretId: string;
  secretKey: string;
}

export class Tencent extends Translator<TencentConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  private static getUTCDate(dateObj: Date): string {
    const year = dateObj.getUTCFullYear();
    const month = `${dateObj.getUTCMonth() + 1}`.padStart(2, "0");
    const date = `${dateObj.getUTCDate()}`.padStart(2, "0");
    return `${year}-${month}-${date}`;
  }

  private signedRequest<R = {}>({
    secretId,
    secretKey,
    action,
    payload,
    service,
    version
  }: {
    secretId: string;
    secretKey: string;
    action: string;
    payload: string;
    service: string;
    version: string;
  }): AxiosPromise<R> {
    const now = new Date();
    const timestamp = `${new Date().valueOf()}`.slice(0, 10);

    const CanonicalRequest: string = [
      "POST",
      "/",
      "",
      "content-type:application/json; charset=utf-8",
      "host:tmt.tencentcloudapi.com",
      "",
      "content-type;host",
      SHA256(payload).toString(EncHEX)
    ].join("\n");

    const datestamp = Tencent.getUTCDate(now);

    const StringToSign: string = [
      "TC3-HMAC-SHA256",
      timestamp,
      `${datestamp}/tmt/tc3_request`,
      SHA256(CanonicalRequest).toString(EncHEX)
    ].join("\n");

    const SecretDate = HMACSHA256(datestamp, `TC3${secretKey}`);

    const SecretService = HMACSHA256("tmt", SecretDate);

    const SecretSigning = HMACSHA256("tc3_request", SecretService);

    const Signature: string = HMACSHA256(StringToSign, SecretSigning).toString(
      EncHEX
    );

    return this.request<R>("https://tmt.tencentcloudapi.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Host: "tmt.tencentcloudapi.com",
        "X-TC-Action": action,
        "X-TC-Timestamp": timestamp,
        "X-TC-Region": "ap-beijing",
        "X-TC-Version": version,
        Authorization: `TC3-HMAC-SHA256 Credential=${secretId}/${datestamp}/tmt/tc3_request, SignedHeaders=content-type;host, Signature=${Signature}`
      },
      data: payload
    });
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: TencentConfig
  ): Promise<TranslateQueryResult> {
    const RequestPayload: string = JSON.stringify({
      ProjectId: 0,
      Source: Tencent.langMap.get(from),
      SourceText: text,
      Target: Tencent.langMap.get(to)
    });

    const { data } = await this.signedRequest<{
      Response: {
        TargetText: string;
        Source: string;
        Target: string;
        RequestId: string;
      };
    }>({
      secretId: config.secretId,
      secretKey: config.secretKey,
      action: "TextTranslate",
      payload: RequestPayload,
      service: "tmt",
      version: "2018-03-21"
    });

    return {
      text: text,
      from: Tencent.langMapReverse.get(data.Response.Source) || from,
      to: Tencent.langMapReverse.get(data.Response.Target) || to,
      origin: {
        paragraphs: text.split(/\n+/)
      },
      trans: {
        paragraphs: data.Response.TargetText.split(/\n+/)
      }
    };
  }

  readonly name = "tencent";

  getSupportLanguages(): Language[] {
    return [...Tencent.langMap.keys()];
  }

  async detect(text: string): Promise<Language> {
    const RequestPayload: string = JSON.stringify({
      ProjectId: 0,
      Text: text
    });

    const { data } = await this.signedRequest<{
      Response: {
        Lang: string;
        RequestId: string;
      };
    }>({
      secretId: this.config.secretId,
      secretKey: this.config.secretKey,
      action: "LanguageDetect",
      payload: RequestPayload,
      service: "tmt",
      version: "2018-03-21"
    });

    return Tencent.langMapReverse.get(data.Response.Lang) || "auto";
  }

  async textToSpeech(text: string, lang: Language): Promise<string | null> {
    const RequestPayload: string = JSON.stringify({
      ProjectId: 0,
      Text: encodeURIComponent(text),
      SessionId: `${Date.now()}`,
      ModelType: -1,
      PrimaryLanguage: lang.startsWith("zh") ? 1 : 2,
      Codec: "mp3"
    });

    const { data } = await this.signedRequest<{
      Response: {
        Audio: string;
        RequestId: string;
        SessionId: string;
      };
    }>({
      secretId: this.config.secretId,
      secretKey: this.config.secretKey,
      action: "TextToVoice",
      payload: RequestPayload,
      service: "tts",
      version: "2019-08-23"
    });

    return data.Response.Audio || null;
  }
}

export default Tencent;
