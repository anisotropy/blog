import { pipe } from "../fp-tool";

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

//
// wrapEnglish
// ---------------

/** 한글과 공백이 없는 연속된 부분을 <span class="english">로 감싼다. 마크다운 링크 [] 부분은 예외. */
export const wrapEnglish = (markdown: string): string => {
  const WRAP_PLACEHOLDER = "\uE000";
  const LINK_OR_IMAGE_REGEX = /!\[[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\)/g;

  const matches = [...markdown.matchAll(LINK_OR_IMAGE_REGEX)];
  const preserved = matches.map((m) => m[0]);

  const withPlaceholders = matches.reduce(
    (s, m, i) => s.replace(m[0], `${WRAP_PLACEHOLDER}${i}${WRAP_PLACEHOLDER}`),
    markdown
  );

  const wrapped = withPlaceholders.replace(
    /([a-zA-Z][a-zA-Z0-9'.\-]*)/g,
    '<span class="english">$1</span>'
  );

  return preserved.reduce(
    (s, p, i) => s.replace(`${WRAP_PLACEHOLDER}${i}${WRAP_PLACEHOLDER}`, p),
    wrapped
  );
};

// TODO: URL을 감싼다.
