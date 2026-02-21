import { describe, it, expect } from "vitest";
import {
  wrapFootnote,
  wrapFootnoteList,
  wrapEnglish,
  wrapUrl,
} from "./converter";

describe("wrapFootnote", () => {
  it("'[^숫자]'앞에 내용이 있으면 그대로 반환한다.", () => {
    const input = "문장.[^1] 문장";
    expect(wrapFootnote(input)).toBe(input);
  });

  it("단일 각주를 div로 감싼다", () => {
    const input = "[^1] 각주 1";
    expect(wrapFootnote(input)).toBe(
      `<div class="footnote">\n\n[^1] 각주 1\n\n</div>`
    );
  });

  it("여러 각주를 각각 div로 감싼다", () => {
    const input = "[^1] 각주 1\n\n[^2] 각주 2";
    expect(wrapFootnote(input)).toBe(
      `<div class="footnote">\n\n[^1] 각주 1\n\n</div>\n\n<div class="footnote">\n\n[^2] 각주 2\n\n</div>`
    );
  });

  it("각주 앞의 내용은 변경하지 않는다", () => {
    const input = "앞 내용\n\n[^1] 각주 1";
    expect(wrapFootnote(input)).toBe(
      `앞 내용\n\n<div class="footnote">\n\n[^1] 각주 1\n\n</div>`
    );
  });

  it("여러 줄인 각주를 하나의 div로 감싼다", () => {
    const input = "[^1] 첫 줄\n두번째 줄\n\n[^2] 각주 2";
    expect(wrapFootnote(input)).toBe(
      `<div class="footnote">\n\n[^1] 첫 줄\n두번째 줄\n\n</div>\n\n<div class="footnote">\n\n[^2] 각주 2\n\n</div>`
    );
  });

  it("[^숫자]가 없으면 그대로 반환한다", () => {
    const input = "일반 텍스트만 있다.";
    expect(wrapFootnote(input)).toBe(input);
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(wrapFootnote("")).toBe("");
  });
});

describe("wrapFootnoteList", () => {
  it("단일 footnote div를 footnote-list로 감싼다", () => {
    const input = `<div class="footnote">\n\n[^1] 각주 1\n\n</div>`;
    expect(wrapFootnoteList(input)).toBe(
      `<div class="footnote-list">\n\n<div class="footnote">\n\n[^1] 각주 1\n\n</div>\n\n</div>`
    );
  });

  it("여러 footnote div를 하나의 footnote-list로 감싼다", () => {
    const input = `<div class="footnote">\n\n[^1] 각주 1\n\n</div>\n\n<div class="footnote">\n\n[^2] 각주 2\n\n</div>`;
    expect(wrapFootnoteList(input)).toBe(
      `<div class="footnote-list">\n\n<div class="footnote">\n\n[^1] 각주 1\n\n</div>\n\n<div class="footnote">\n\n[^2] 각주 2\n\n</div>\n\n</div>`
    );
  });

  it("footnote 앞의 내용은 변경하지 않는다", () => {
    const input = `앞 내용\n\n<div class="footnote">\n\n[^1] 각주 1\n\n</div>`;
    expect(wrapFootnoteList(input)).toBe(
      `앞 내용\n\n<div class="footnote-list">\n\n<div class="footnote">\n\n[^1] 각주 1\n\n</div>\n\n</div>`
    );
  });

  it("footnote가 없으면 그대로 반환한다", () => {
    const input = "일반 텍스트만 있다.";
    expect(wrapFootnoteList(input)).toBe(input);
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(wrapFootnoteList("")).toBe("");
  });
});

describe("wrapEnglish", () => {
  it("영어 단어를 span으로 감싼다", () => {
    expect(wrapEnglish("Hello")).toBe('<span class="english">Hello</span>');
  });

  it("여러 영어 단어를 각각 span으로 감싼다", () => {
    expect(wrapEnglish("Hello world")).toBe(
      '<span class="english">Hello</span> <span class="english">world</span>'
    );
  });

  it("한글과 영어가 섞여 있으면 영어만 감싼다", () => {
    expect(wrapEnglish("안녕 Hello 세계")).toBe(
      '안녕 <span class="english">Hello</span> 세계'
    );
  });

  it("아포스트로피가 포함된 단어를 감싼다", () => {
    expect(wrapEnglish("don't")).toBe('<span class="english">don\'t</span>');
  });

  it("마침표와 하이픈이 포함된 단어를 감싼다", () => {
    expect(wrapEnglish("e.g. well-known")).toBe(
      '<span class="english">e.g.</span> <span class="english">well-known</span>'
    );
  });

  it("한글만 있으면 그대로 반환한다", () => {
    const input = "한글만 있는 문장";
    expect(wrapEnglish(input)).toBe(input);
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(wrapEnglish("")).toBe("");
  });

  it("공백만 있으면 그대로 반환한다", () => {
    expect(wrapEnglish("   ")).toBe("   ");
  });

  it("숫자만 있으면 감싸지 않는다", () => {
    expect(wrapEnglish("123")).toBe("123");
  });

  it("마크다운 구문과 함께 있어도 영어는 감싼다", () => {
    expect(wrapEnglish("**bold**")).toBe(
      '**<span class="english">bold</span>**'
    );
  });

  it("마크다운 링크의 () 부분은 감싸지 않는다", () => {
    expect(wrapEnglish("[GitHub](https://github.com)")).toBe(
      '[<span class="english">GitHub</span>](https://github.com)'
    );
    expect(wrapEnglish("참고 [documentation](https://example.com) 링크")).toBe(
      '참고 [<span class="english">documentation</span>](https://example.com) 링크'
    );
  });

  it("마크다운 이미지의 () 부분은 감싸지 않는다", () => {
    expect(wrapEnglish("![alt text](image.png)")).toBe(
      '![<span class="english">alt</span> <span class="english">text</span>](image.png)'
    );
  });

  it("URL은 감싸지 않는다", () => {
    expect(wrapEnglish("자세한 내용은 https://example.com 참고")).toBe(
      "자세한 내용은 https://example.com 참고"
    );
    expect(wrapEnglish("see https://example.com here")).toBe(
      '<span class="english">see</span> https://example.com <span class="english">here</span>'
    );
  });
});

describe("wrapUrl", () => {
  it("URL을 span으로 감싼다", () => {
    expect(wrapUrl("https://example.com")).toBe(
      '<span class="url">https://example.com</span>'
    );
  });

  it("여러 URL을 각각 span으로 감싼다", () => {
    expect(wrapUrl("https://a.com 그리고 https://b.com")).toBe(
      '<span class="url">https://a.com</span> 그리고 <span class="url">https://b.com</span>'
    );
  });

  it("마크다운 링크의 () 부분은 감싸지 않는다", () => {
    expect(wrapUrl("[https://github.com](https://github.com)")).toBe(
      '[<span class="url">https://github.com</span>](https://github.com)'
    );
  });

  it("마크다운 이미지의 () 부분은 감싸지 않는다", () => {
    expect(
      wrapUrl("![https://example.com/image.png](https://example.com/image.png)")
    ).toBe(
      '![<span class="url">https://example.com/image.png</span>](https://example.com/image.png)'
    );
  });

  it("일반 텍스트의 URL은 감싼다", () => {
    expect(wrapUrl("자세한 내용은 https://example.com 참고")).toBe(
      '자세한 내용은 <span class="url">https://example.com</span> 참고'
    );
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(wrapUrl("")).toBe("");
  });
});
