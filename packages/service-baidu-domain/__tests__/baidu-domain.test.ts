import { BaiduDomain } from "../src";

describe("Dict BaiduDomain", () => {
  const baiduDomainMedicine = new BaiduDomain({
    config: {
      domain: "medicine",
      key: process.env.KEY as string,
      appid: process.env.APPID as string
    }
  });

  it("should translate en2zh successfully", async () => {
    const result = await baiduDomainMedicine.translate(
      "amyotrophic lateral sclerosis",
      "en",
      "zh-CN"
    );

    expect(result).toEqual({
      engine: "baidu-domain",
      text: "amyotrophic lateral sclerosis",
      from: "en",
      to: "zh-CN",
      /** 原文 */
      origin: {
        paragraphs: ["amyotrophic lateral sclerosis"],
        tts: expect.any(String)
      },
      /** 译文 */
      trans: {
        paragraphs: ["肌萎缩侧索硬化症"],
        tts: expect.any(String)
      }
    });
  }, 5000);

  it("should translate zh2en successfully", async () => {
    const result = await baiduDomainMedicine.translate(
      "肌萎缩侧索硬化症",
      "zh-CN",
      "en"
    );

    expect(result).toEqual({
      engine: "baidu-domain",
      text: "肌萎缩侧索硬化症",
      from: "zh-CN",
      to: "en",
      /** 原文 */
      origin: {
        paragraphs: ["肌萎缩侧索硬化症"],
        tts: expect.any(String)
      },
      /** 译文 */
      trans: {
        paragraphs: ["Amyotrophic lateral sclerosis"],
        tts: expect.any(String)
      }
    });
  }, 5000);

  it("should get supported languages", () => {
    const result = baiduDomainMedicine.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);
});
