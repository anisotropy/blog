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

export const FOOTNOTE = "footnote";
export const FOOTNOTE_LIST = "footnote-list";

/** 문단이 [^숫자](C)로 시작하는 곳을 찾아, C부터 다음 C 직전까지 <div class="footnote">로 묶는다. 문단 시작이 아니면 그대로 반환한다. */
export const wrapFootnote = (markdown: string): string => {
  return markdown
    .split(/(^|\n|\n\n)(?=\[\^[^\]]+\])/)
    .map((part) => {
      const trimmed = part.trimStart();
      if (/^\[\^[^\]]+\]/.test(trimmed)) {
        const block = part.trimEnd();
        return block ? `<div class="${FOOTNOTE}">\n\n${block}\n\n</div>` : part;
      }
      return part;
    })
    .join("");
};

/** <div class="footnote">가 있는 전체 영역을 <div class="footnote-list">로 감싼다 */
export const wrapFootnoteList = (markdown: string): string => {
  const footnoteBlockRegex = new RegExp(
    `((?:<div class=\"${FOOTNOTE}\">[\\s\\S]*?</div>\\s*)+)`
  );
  return markdown.replace(footnoteBlockRegex, (match) =>
    match.trim()
      ? `<div class="${FOOTNOTE_LIST}">\n\n${match.trim()}\n\n</div>`
      : match
  );
};

/** '[^숫자]'를 <sup>숫자</sup>로 변환한다 */
export const convertRefToSup = (markdown: string): string =>
  markdown.replace(/\[\^([^\]]+)\]/g, "<sup>$1</sup>");

export const createFootnote = (markdown: string) =>
  pipe(markdown, wrapFootnote, wrapFootnoteList, convertRefToSup);
