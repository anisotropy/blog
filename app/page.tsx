import { Client } from "@notionhq/client";
import { O } from "./fp-tool";
import { HomeViewer } from "./component";

const notion = new Client({ auth: process.env.NOTION_KEY });

const DATA_SOURCE_ID = process.env.DATA_SOURCE_ID ?? "";

export default async function Home() {
  const { results } = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "태그",
      multi_select: { contains: "공개" },
    },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
    result_type: "page",
  });

  const pageList = results.map((result) => {
    const title =
      O.get(result, ["properties", "이름", "title", 0, "text", "content"]) ??
      "";
    const createdTime = O.get(result, ["created_time"]) ?? "";
    const id = O.get(result, ["id"]) ?? "";
    return { id, title, createdTime };
  });

  return <HomeViewer pageList={pageList} />;
}
