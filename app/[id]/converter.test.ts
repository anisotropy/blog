import { describe, it, expect } from "vitest";
import { separateBlockQuotes, makeFootnoteSection } from "./converter";

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

describe("createFootnote", () => {
  it("문단이 [^숫자]로 시작하면 div로 감싼다", () => {
    const input = "본문 내용.\n\n\n[^1] 각주 1\n\n\n[^2] 각주 2";
    const expected =
      '본문 내용.\n\n\n<div class="footnotes">\n\n\n[^1] 각주 1\n\n\n[^2] 각주 2\n\n\n</div>';
    expect(makeFootnoteSection(input)).toBe(expected);
  });

  it("문단이 [^숫자]로 시작하면 div로 감싼다", () => {
    const input = "본문 내용.\n\n[^1] 각주 1\n\n[^2] 각주 2";
    const expected =
      '본문 내용.\n\n<div class="footnotes">\n\n\n[^1] 각주 1\n\n[^2] 각주 2\n\n\n</div>';
    expect(makeFootnoteSection(input)).toBe(expected);
  });

  it("문단이 [^숫자]로 시작하면 div로 감싼다", () => {
    const input = "본문 내용.\n[^1] 각주 1\n[^2] 각주 2";
    const expected =
      '본문 내용.\n<div class="footnotes">\n\n\n[^1] 각주 1\n[^2] 각주 2\n\n\n</div>';
    expect(makeFootnoteSection(input)).toBe(expected);
  });

  it("[^숫자]로 시작하는 문단이 없으면 그대로 반환한다", () => {
    const input = "일반 텍스트만 있다.";
    expect(makeFootnoteSection(input)).toBe(input);
  });

  it("전체가 [^1]로 시작하면 div로 감싼다", () => {
    const input = "[^1] 각주 1";
    const expected = '<div class="footnotes">\n\n\n[^1] 각주 1\n\n\n</div>';
    expect(makeFootnoteSection(input)).toBe(expected);
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(makeFootnoteSection("")).toBe("");
  });
});
