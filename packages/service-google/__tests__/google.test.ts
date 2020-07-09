/* eslint-disable @typescript-eslint/no-explicit-any */

import { Google } from "../src";
import axios from "axios";

describe("Dict Google", () => {
  let retry = 10;
  axios.interceptors.response.use(
    null as any,
    async (error): Promise<any> => {
      if (retry--) {
        await new Promise((resolve): void => {
          setTimeout(resolve, 500);
        });

        return axios.request(error.config);
      }

      return Promise.reject(error);
    }
  );

  const google = new Google();

  it("should translate successfully", async done => {
    const result = await google.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "google",
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

    done();
  }, 10000);

  it("should get supported languages", () => {
    const result = google.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  });

  it("should detect language for a given text", async done => {
    const lang = await google.detect("你好");

    expect(lang).toBe("zh-CN");

    done();
  }, 10000);
});
