import { languages } from "../src/languages";
import en from "../locales/en.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";

describe("Locales", () => {
  it("should provide locale for every supported language", () => {
    expect(Object.keys(en).length).toBe(languages.length);
    expect(Object.keys(zhCN).length).toBe(languages.length);
    expect(Object.keys(zhTW).length).toBe(languages.length);
    languages.forEach(key => {
      expect(en[key]).toBeDefined();
      expect(zhTW[key]).toBeDefined();
      expect(zhCN[key]).toBeDefined();
    });
  });
});
