import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Anchor,
  Div,
  OrderedList,
  Paragraph,
  Quote,
  UnorderedList,
} from "./component";
import { O, pipe } from "../fp-tool";
import { createFootnote } from "./converter";

const notion = new Client({ auth: process.env.NOTION_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [metaData, markdownBlocks] = await Promise.all([
    notion.pages.retrieve({ page_id: id }),
    n2m.pageToMarkdown(id),
  ]);

  const title = O.get(metaData, [
    "properties",
    "이름",
    "title",
    0,
    "plain_text",
  ]);

  const lastEditedTime = new Date(
    O.get(metaData, ["last_edited_time"]) ?? ""
  ).toLocaleString("ko-KR");

  const content = pipe(
    n2m.toMarkdownString(markdownBlocks).parent,
    createFootnote
  );

  return (
    <div className="max-w-prose mx-auto p-10 text-justify break-all leading-[1.7em]">
      <section className="mb-6">
        <h1 className="text-center text-2xl mb-4">{title}</h1>
        <div className="text-right text-sm">정호득 {lastEditedTime}</div>
      </section>
      <section>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            p: Paragraph,
            blockquote: Quote,
            div: Div,
            a: Anchor,
            ol: OrderedList,
            ul: UnorderedList,
          }}
        >
          {content}
        </Markdown>
      </section>
    </div>
  );
}
