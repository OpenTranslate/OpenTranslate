import { Tencent } from "../src";

describe("Dict Tencent", () => {
  const tencent = new Tencent({
    config: {
      secretId: process.env.TENCENT_ID as string,
      secretKey: process.env.TENCENT_KEY as string
    }
  });

  it("should translate successfully", async () => {
    const result = await tencent.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "tencent",
      text: "I love you",
      from: "en",
      to: "zh-CN",
      /** 原文 */
      origin: {
        paragraphs: ["I love you"]
      },
      /** 译文 */
      trans: {
        paragraphs: [expect.stringContaining("爱")]
      }
    });
  }, 5000);

  it("should get supported languages", () => {
    const result = tencent.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);

  it("should detect language for a given text", async () => {
    const lang = await tencent.detect("你好");

    expect(lang).toBe("zh-CN");
  });
});
