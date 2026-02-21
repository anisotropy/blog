"use client";

import { createContext, useContext } from "react";
import { Components } from "react-markdown";
import { FOOTNOTE, FOOTNOTE_LIST } from "./converter";

const BlockquoteContext = createContext(false);

const FootnoteContext = createContext(false);

export const Paragraph: Components["p"] = (props) => {
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

export const Quote: Components["blockquote"] = (props) => {
  const isInFootnoteList = useContext(FootnoteContext);
  return (
    <blockquote
      className={
        isInFootnoteList ? "text-[0.87em] pl-3 my-2" : "text-[0.93em] pl-4 my-4"
      }
    >
      <BlockquoteContext.Provider value={true}>
        {props.children}
      </BlockquoteContext.Provider>
    </blockquote>
  );
};

export const Div: Components["div"] = (props) => {
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

export const Anchor: Components["a"] = (props) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  />
);

export const OrderedList: Components["ol"] = (props) => (
  <ol className="list-decimal ml-3">{props.children}</ol>
);

export const UnorderedList: Components["ul"] = (props) => (
  <ol className="list-disc ml-3">{props.children}</ol>
);
