import { Baidu } from "../src";

describe("Dict Baidu", () => {
  //Please refer to http://api.fanyi.baidu.com/api/trans/product/prodinfo
  const baidu = new Baidu({
    config: {
      appid: process.env.APP_ID as string,
      key: process.env.KEY as string
    }
  });

  it("should translate en2zh successfully", async () => {
    const En2Zh = await baidu.translate("I love you", "auto", "zh-CN");

    expect(En2Zh).toEqual({
      engine: "baidu",
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
  }, 9000);

  it("should translate zh2en successfully", async () => {
    const zh2En = await baidu.translate("我爱你", "auto", "en");

    expect(zh2En).toEqual({
      engine: "baidu",
      text: "我爱你",
      from: "zh-CN",
      to: "en",
      /** 原文 */
      origin: {
        paragraphs: ["我爱你"],
        tts: expect.any(String)
      },
      /** 译文 */
      trans: {
        paragraphs: [expect.stringContaining("I love you")],
        tts: expect.any(String)
      }
    });
  }, 9000);

  it("should get supported languages", () => {
    const result = baidu.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);
});
