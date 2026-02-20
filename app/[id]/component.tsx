"use client";

import { createContext, useContext } from "react";
import { Components } from "react-markdown";
import { FOOTNOTE, FOOTNOTE_LIST } from "./converter";

const BlockquoteContext = createContext(false);

const FootnoteContext = createContext(false);

export const Paragraph: Components["p"] = (props) => {
  const isInBlockquote = useContext(BlockquoteContext);
  const isInFootnoteSection = useContext(FootnoteContext);
  if (isInFootnoteSection && isInBlockquote) {
    return <p className="text-[0.87em] pl-3 my-2">{props.children}</p>;
  }
  if (isInFootnoteSection) {
    return (
      <p className="text-[0.93em] indent-[1em] first:indent-[-0.7em]">
        {props.children}
      </p>
    );
  }
  if (isInBlockquote) {
    return <p className="text-[0.93em] pl-4 my-4">{props.children}</p>;
  }
  return <p className="indent-[1em]">{props.children}</p>;
};

export const Quote: Components["blockquote"] = (props) => (
  <blockquote>
    <BlockquoteContext.Provider value={true}>
      {props.children}
    </BlockquoteContext.Provider>
  </blockquote>
);

export const Div: Components["div"] = (props) => {
  if (props.className === FOOTNOTE) {
    return <div className="my-2">{props.children}</div>;
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
