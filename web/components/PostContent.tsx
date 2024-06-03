import Link from "next/link";
import ReactMarkdown from "react-markdown";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <img src={post?.imageUrl} className="w-full" alt={post?.title} />
      <span className="text-lg">
        Written by{" "}
        <Link href={`/${post.username}/`} legacyBehavior>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>
      <h1>{post?.title}</h1>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          {post.tags.map((tag : string, index: number) => (
            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <h2>Publicaddr: {post?.publicaddr}</h2>
      <h3>Description: {post?.description}</h3>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
