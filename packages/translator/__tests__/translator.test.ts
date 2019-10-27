/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TranslateError,
  Translator,
  TranslateQueryResult,
  Language,
  Languages
} from "../src";

describe("Translator", () => {
  it("should successfully return result", async () => {
    class TestTranslator extends Translator {
      name = "test";

      textToSpeech(text: string, lang: string): Promise<string> {
        return Promise.resolve("https://hello.com/a.mp3");
      }

      getSupportLanguages(): Languages {
        return ["en"];
      }

      query(
        text: string,
        from: Language,
        to: Language,
        config: {}
      ): Promise<TranslateQueryResult> {
        return Promise.resolve({
          text: text,
          from,
          to,
          origin: {
            paragraphs: ["origin text"]
          },
          trans: {
            paragraphs: ["trans text"]
          }
        });
      }
    }

    const translator: Translator = new TestTranslator();

    const result = await translator.translate("hello", "en", "zh-CN");

    expect(result).toEqual({
      engine: "test",
      text: "hello",
      from: "en",
      to: "zh-CN",
      origin: {
        paragraphs: ["origin text"]
      },
      trans: {
        paragraphs: ["trans text"]
      }
    });

    const tts = await translator.textToSpeech("hello", "en");
    if (tts != undefined) {
      expect(tts).toBe("https://hello.com/a.mp3");
    }
  }, 20000);

  it("should throw error when failed", async () => {
    class FailTranslator extends Translator {
      name = "FailTranslator";

      getSupportLanguages(): Languages {
        return ["en"];
      }

      query(): Promise<TranslateQueryResult> {
        throw new TranslateError("UNKNOWN");
      }
    }

    try {
      await new FailTranslator().translate("hello", "en", "zh-CN");
    } catch (e) {
      expect(e.message).toBe("UNKNOWN");
    }
  }, 20000);

  it("should parse config correctly", async () => {
    type Translator1Config = { opt1?: string; opt2?: string; opt3?: string };

    class Translator1 extends Translator<Translator1Config> {
      name = "Translator1";
      getSupportLanguages = (): Languages => [];
      query = jest.fn();
    }

    const translator1 = new Translator1({
      config: {
        opt1: "opt1",
        opt2: "opt2"
      }
    });

    translator1.translate("text1", "en", "zh-CN");
    expect(translator1.query).lastCalledWith("text1", "en", "zh-CN", {
      opt1: "opt1",
      opt2: "opt2"
    });

    translator1.translate("text1", "en", "zh-CN", {
      opt1: "opt11",
      opt3: "opt3"
    });
    expect(translator1.query).lastCalledWith("text1", "en", "zh-CN", {
      opt1: "opt11",
      opt2: "opt2",
      opt3: "opt3"
    });
  });
});
