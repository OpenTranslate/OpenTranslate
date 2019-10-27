import { detectLang } from "../src/detect-lang";
/* eslint-disable @typescript-eslint/no-unused-vars */
test("Detect Lang", () => {
  expect(detectLang("你好")).toBe("zh-CN");
  expect(detectLang("オープン トランスレート")).toBe("ja");
  expect(detectLang("고마워요")).toBe("ko");
  expect(detectLang("open translate")).toBe("en");
});
