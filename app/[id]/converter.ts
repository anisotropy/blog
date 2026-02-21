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
// withPreservedLinks
// ---------------

/**
 * 마크다운 링크/이미지의 () 부분만 보존하고 [] 부분에 transform을 적용한다.
 */
const replaceParensWithPlaceholder = (
  match: string,
  i: number,
  placeholder: string
) => {
  const parenPart = match.match(/\([^)]*\)/)![0];
  const bracketPart = match.slice(0, match.length - parenPart.length);
  return `${bracketPart}${placeholder}${i}${placeholder}`;
};

const withPreservedLinks = (
  markdown: string,
  transform: (text: string) => string
): string => {
  const PLACEHOLDER_IMAGE = "\uE001";
  const PLACEHOLDER_LINK = "\uE002";

  const imageMatches = [...markdown.matchAll(/!\[[^\]]*\]\([^)]*\)/g)];
  const linkMatches = [...markdown.matchAll(/(?<!!)\[[^\]]*\]\([^)]*\)/g)];

  const withPlaceholders = linkMatches.reduce(
    (s, m, i) =>
      s.replace(m[0], replaceParensWithPlaceholder(m[0], i, PLACEHOLDER_LINK)),
    imageMatches.reduce(
      (s, m, i) =>
        s.replace(
          m[0],
          replaceParensWithPlaceholder(m[0], i, PLACEHOLDER_IMAGE)
        ),
      markdown
    )
  );

  const transformed = transform(withPlaceholders);

  return imageMatches.reduce(
    (s, m, i) =>
      s.replace(
        `${PLACEHOLDER_IMAGE}${i}${PLACEHOLDER_IMAGE}`,
        m[0].match(/\([^)]*\)/)![0]
      ),
    linkMatches.reduce(
      (s, m, i) =>
        s.replace(
          `${PLACEHOLDER_LINK}${i}${PLACEHOLDER_LINK}`,
          m[0].match(/\([^)]*\)/)![0]
        ),
      transformed
    )
  );
};

//
// wrapEnglish
// ---------------

const URL_REGEX = /https?:\/\/[^\s<>"'\]]+/g;

/** 영문으로 된 부분을 <span class="english">로 감싼다. 마크다운 링크의 () 부분과 URL은 예외. */
export const wrapEnglish = (markdown: string): string =>
  withPreservedLinks(markdown, (text) => {
    const PLACEHOLDER_URL = "\uE003";
    const urlMatches = [...text.matchAll(URL_REGEX)];
    const withPlaceholders = urlMatches.reduce(
      (s, m, i) => s.replace(m[0], `${PLACEHOLDER_URL}${i}${PLACEHOLDER_URL}`),
      text
    );
    const wrapped = withPlaceholders.replace(
      /([a-zA-Z][a-zA-Z0-9'.\-]*)/g,
      '<span class="english">$1</span>'
    );
    return urlMatches.reduce(
      (s, m, i) => s.replace(`${PLACEHOLDER_URL}${i}${PLACEHOLDER_URL}`, m[0]),
      wrapped
    );
  });

//
// wrapUrl
// ---------------

/** URL을 <span class="url">로 감싼다. 마크다운 링크의 () 부분은 예외. */
export const wrapUrl = (markdown: string): string =>
  withPreservedLinks(markdown, (text) =>
    text.replace(URL_REGEX, (url) => `<span class="url">${url}</span>`)
  );
