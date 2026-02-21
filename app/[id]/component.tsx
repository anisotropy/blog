"use client";

import { createContext, useContext } from "react";
import Markdown, { Components } from "react-markdown";
import { FOOTNOTE, FOOTNOTE_LIST } from "./converter";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

const BlockquoteContext = createContext(false);

const FootnoteContext = createContext(false);

const Paragraph: Components["p"] = (props) => {
  const isInBlockquote = useContext(BlockquoteContext);
  const isInFootnoteList = useContext(FootnoteContext);
  const className = [
    "my-2",
    !isInBlockquote ? "indent-[1em]" : null,
    isInFootnoteList && !isInBlockquote ? "first:indent-[-0.7em]" : null,
  ]
    .filter(Boolean)
    .join(" ");
  return <p className={className}>{props.children}</p>;
};

const Quote: Components["blockquote"] = (props) => {
  const isInFootnoteList = useContext(FootnoteContext);
  return (
    <blockquote
      className={
        isInFootnoteList ? "text-[0.9em] pl-3 my-2" : "text-[0.93em] pl-4 my-4"
      }
    >
      <BlockquoteContext.Provider value={true}>
        {props.children}
      </BlockquoteContext.Provider>
    </blockquote>
  );
};

const Div: Components["div"] = (props) => {
  if (props.className === FOOTNOTE) {
    return <div className="my-2 ml-3 text-[0.93em]">{props.children}</div>;
  }
  if (props.className === FOOTNOTE_LIST) {
    return (
      <>
        <hr className="my-4"></hr>
        <div>
          <FootnoteContext.Provider value={true}>
            {props.children}
          </FootnoteContext.Provider>
        </div>
      </>
    );
  }
  return <div>{props.children}</div>;
};

// TODO: 스타일을 global.css에 추가
const Anchor: Components["a"] = (props) =>
  props.href ? (
    <Link
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-current/30"
    >
      {props.children}
    </Link>
  ) : (
    props.children
  );

const Span: Components["span"] = (props) => {
  if (props.className === "english") {
    return (
      <span className="font-main-en hyphens-auto" lang="en">
        {props.children}
      </span>
    );
  }
  if (props.className === "url") {
    return (
      <span className="font-main-en break-all" lang="en">
        {props.children}
      </span>
    );
  }
  return props.children;
};

export const PageViewer = (props: {
  content: string;
  metadata: {
    title: string;
    author: string;
    createdTime: string;
    lastEditedTime: string;
  };
}) => {
  const { title, author } = props.metadata;
  const lastEditedTime = new Date(props.metadata.lastEditedTime).toLocaleString(
    "ko-KR",
    { timeZone: "Asia/Seoul" }
  );
  const createdTime = new Date(props.metadata.createdTime).toLocaleString(
    "ko-KR",
    { timeZone: "Asia/Seoul" }
  );
  return (
    <div>
      <nav className="mb-10 text-right">
        <Link href="/" className="text-[0.9em] underline decoration-current/30">
          목차로 이동
        </Link>
      </nav>
      <section className="mb-8">
        <h1 className="text-center text-2xl">{title}</h1>
        <div className="ml-[1em] mt-8">
          <div className="text-[0.9em] leading-[1.5em]">
            <div>작성자: {author}</div>
            <div>작성일: {createdTime}</div>
            <div>마지막 수정일: {lastEditedTime}</div>
          </div>
        </div>
      </section>
      <section>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            p: Paragraph,
            blockquote: Quote,
            div: Div,
            a: Anchor,
            span: Span,
          }}
        >
          {props.content}
        </Markdown>
      </section>
    </div>
  );
};
