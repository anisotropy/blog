import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import Markdown from "react-markdown";

const notion = new Client({ auth: process.env.NOTION_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const mdBlocks = await n2m.pageToMarkdown(id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  return <Markdown>{mdString.parent}</Markdown>;
}
