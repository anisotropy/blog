import Link from "next/link";

const PageListItem = (props: {
  id: string;
  title: string;
  createdTime: string;
}) => {
  const { id, title } = props;
  const createdTime = new Date(props.createdTime).toLocaleString("ko-KR", {
    dateStyle: "long",
    timeZone: "Asia/Seoul",
  });
  return (
    <li key={id} className="my-2">
      <Link className="underline decoration-current/30" href={`/${props.id}`}>
        {title} ({createdTime})
      </Link>
    </li>
  );
};

export const HomeViewer = (props: {
  pageList: { id: string; title: string; createdTime: string }[];
}) => (
  <div>
    <h1 className="text-3xl text-center">짧은 글</h1>
    <section className="ml-3">
      <h2 className="text-xl mt-20">목차</h2>
      <ul className="mt-3">
        {props.pageList.map(({ id, title, createdTime }) => (
          <PageListItem
            key={id}
            id={id}
            title={title}
            createdTime={createdTime}
          />
        ))}
      </ul>
    </section>
  </div>
);
