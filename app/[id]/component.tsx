"use client";

import { createContext, useContext } from "react";
import { Components } from "react-markdown";
import { FOOTNOTES } from "./converter";

const BlockquoteContext = createContext(false);

const FootnoteContext = createContext(false);

export const Paragraph: Components["p"] = (props) => {
  const isInBlockquote = useContext(BlockquoteContext);
  const isInFootnoteSection = useContext(FootnoteContext);
  if (isInFootnoteSection && isInBlockquote) {
    return <p className="text-[0.93em] pl-3 my-2">{props.children}</p>;
  }
  if (isInBlockquote) {
    return <p className="text-[0.93em] pl-4 my-4">{props.children}</p>;
  }
  if (isInFootnoteSection) {
    return <li className="text-[0.93em] my-2">{props.children}</li>;
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
  if (props.className?.includes(FOOTNOTES)) {
    return (
      <>
        <hr className="my-4"></hr>
        <ol>
          <FootnoteContext.Provider value={true}>
            {props.children}
          </FootnoteContext.Provider>
        </ol>
      </>
    );
  } else {
    return <div>{props.children}</div>;
  }
};

export const Anchor: Components["a"] = (props) => (
  <a
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  />
);
