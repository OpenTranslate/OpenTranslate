import { Google } from "../src";

describe("Dict Google", () => {
  const google = new Google();

  it("should translate successfully", async () => {
    const result = await google.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "google",
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
    const result = google.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);
});
