import { Deepl } from "../src";

describe("Dict Deepl", () => {
  const deepl = new Deepl({
    config: { ["auth_key"]: process.env.DEEPL_KEY as string }
  });

  it("should translate successfully", async () => {
    const result = await deepl.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "deepl",
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
        tts: expect.any(String)
      }
    });
  }, 5000);

  it("should get supported languages", () => {
    const result = deepl.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);
});
