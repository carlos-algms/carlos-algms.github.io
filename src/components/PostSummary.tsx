type PostSummaryProps = {
  summary: string;
  title: string;
  slug: string;
};

export default function PostSummary({
  summary,
  title,
  slug,
}: PostSummaryProps) {
  return (
    <article>
      <a href={`/blog/${slug}/`}>
        <h2>{title}</h2>
      </a>
      <div
        dangerouslySetInnerHTML={{
          __html: summary.split('<!-- more -->')[0],
        }}
      ></div>
    </article>
  );
}
