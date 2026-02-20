import { Client } from "@notionhq/client";
import { O } from "./fp-tool";

const notion = new Client({ auth: process.env.NOTION_KEY });

const DATA_SOURCE_ID = "6cbbaa07-0f09-49c0-a6ba-437f31172d3c";

export default async function Home() {
  const { results } = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "태그",
      multi_select: { contains: "공개" },
    },
    result_type: "page",
  });

  return (
    <div>
      {results.map((result) => {
        const title = O.get(result, [
          "properties",
          "이름",
          "title",
          0,
          "text",
          "content",
        ]);
        return title;
      })}
    </div>
  );
}
