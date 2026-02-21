import { Client } from "@notionhq/client";
import { O } from "./fp-tool";
import Link from "next/link";

const notion = new Client({ auth: process.env.NOTION_KEY });

const DATA_SOURCE_ID = "6cbbaa07-0f09-49c0-a6ba-437f31172d3c";

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

  return (
    <div className="max-w-prose mx-auto p-10 text-justify break-all leading-[1.7em]">
      <h1 className="text-3xl text-center">짧은 글</h1>
      <section className="ml-3">
        <h2 className="text-xl mt-20">목차</h2>
        <ul className="list-disc ml-3 mt-3">
          {results.map((result) => {
            const title = O.get(result, [
              "properties",
              "이름",
              "title",
              0,
              "text",
              "content",
            ]);
            const createdTime = new Date(
              O.get(result, ["created_time"]) ?? ""
            ).toLocaleString("ko-KR", { dateStyle: "long" });
            const id = O.get(result, ["id"]);
            return (
              <li key={id} className="my-2">
                <Link
                  className="underline decoration-current/30"
                  href={`/${id}`}
                >
                  {title} ({createdTime})
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
