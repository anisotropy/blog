import { pipe } from "../fp-tool";

//
// separateBlockQuotes
// -----------------------

/** 연속된 blockquote(>) 사이에 빈 줄을 넣어 별도 blockquote로 분리 */
export const separateBlockQuotes = (md: string): string => {
  return md.replace(/(  )?\n(>)/g, (match, lineBreakSpaces, gt) =>
    lineBreakSpaces ? match : `\n\n${gt}`
  );
};

//
// createFootnote
// -------------------

export const FOOTNOTES = "footnotes";

/** '[^숫자]'를 <sup>숫자</sup>로 변환한다 */
export const convertRefToSup = (markdown: string): string =>
  markdown.replace(/\[\^([^\]]+)\]/g, "<sup>$1</sup>");

/**
 * 문단이 [^숫자]로 시작하면, 그 위에 <div class="footnotes">를 추가하고 마크다운 마지막에 </div>를 추가한다.
 */
export const makeFootnoteSection = (markdown: string): string => {
  const lines = markdown.split("\n");
  const footnoteStartIndex = lines.findIndex((line) =>
    /^\s*\[\^[^\]]+\]/.test(line)
  );
  if (footnoteStartIndex === -1) return markdown;

  const contentLines = lines.slice(0, footnoteStartIndex);
  const footnoteLines = lines.slice(footnoteStartIndex);
  const content = contentLines.join("\n");
  const footnotes = footnoteLines.join("\n");
  const separator = content ? "\n" : "";
  return `${content}${separator}<div class="${FOOTNOTES}">\n\n\n${footnotes}\n\n\n</div>`;
};

export const createFootnote = (markdown: string) =>
  pipe(markdown, makeFootnoteSection, convertRefToSup);
