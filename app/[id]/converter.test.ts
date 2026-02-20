import { describe, it, expect } from "vitest";
import {
  separateBlockQuotes,
  wrapFootnote,
  wrapFootnoteList,
} from "./converter";

describe("separateBlockQuotes", () => {
  it("연속된 blockquote 사이에 빈 줄을 넣는다", () => {
    const input = "> line1\n> line2";
    expect(separateBlockQuotes(input)).toBe("> line1\n\n> line2");
  });

  it("여러 연속 blockquote를 각각 분리한다", () => {
    const input = "> a\n> b\n> c";
    expect(separateBlockQuotes(input)).toBe("> a\n\n> b\n\n> c");
  });

  it("두 칸 공백(soft line break) 뒤의 blockquote는 유지한다", () => {
    const input = "> line1  \n> line2";
    expect(separateBlockQuotes(input)).toBe("> line1  \n> line2");
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(separateBlockQuotes("")).toBe("");
  });

  it("단일 blockquote는 변경하지 않는다", () => {
    const input = "> single line";
    expect(separateBlockQuotes(input)).toBe(input);
  });

  it("blockquote가 없는 일반 텍스트는 변경하지 않는다", () => {
    const input = "hello\nworld";
    expect(separateBlockQuotes(input)).toBe(input);
  });
});

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
