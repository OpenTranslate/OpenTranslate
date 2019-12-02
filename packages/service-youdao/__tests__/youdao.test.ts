import { Youdao } from "../src";

describe("Dict Youdao", () => {
  const youdao = new Youdao({
    config: {
      appKey: process.env.APP_KEY as string,
      key: process.env.KEY as string
    }
  });

  it("should translate successfully", async () => {
    const result = await youdao.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "youdao",
      text: "I love you",
      from: "en",
      to: "zh-CN",
      /** 原文 */
      origin: {
        paragraphs: ["I love you"],
        tts: expect.any(String)
      },
      /** 译文 */
      trans: {
        paragraphs: [expect.stringContaining("爱")],
        tts: undefined // 有道语音不支持中文，所以这里是 undefined
      }
    });
  }, 5000);

  it("should get supported languages", () => {
    const result = youdao.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);

  // it("should detect language for a given text", async () => {
  //   const lang = await youdao.detect("你好");
  //
  //   expect(lang).toBe("zh-CN");
  // });
});
