import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageViewer } from "./component";
import { O, pipe } from "../fp-tool";
import { createFootnote } from "./converter";

const notion = new Client({ auth: process.env.NOTION_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const [metadata, markdownBlocks] = await Promise.all([
    notion.pages.retrieve({ page_id: id }),
    n2m.pageToMarkdown(id),
  ]);

  const title =
    O.get(metadata, ["properties", "이름", "title", 0, "plain_text"]) ?? "";

  const lastEditedTime = O.get(metadata, ["last_edited_time"]) ?? "";

  const createdTime = O.get(metadata, ["created_time"]) ?? "";

  const content = pipe(
    n2m.toMarkdownString(markdownBlocks).parent,
    createFootnote
  );

  return (
    <PageViewer
      content={content}
      metadata={{ title, lastEditedTime, createdTime, author: "정호득" }}
    />
  );
}
