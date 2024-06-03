import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function PostItem({ post, admin }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <Link href={`/${post.username}`} legacyBehavior>
        <a className="text-indigo-600 hover:text-indigo-800 font-semibold">
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      {!admin ? <Link href={`/${post.username}/${post.slug}`} legacyBehavior>
        <h2 className="mt-2 text-xl text-gray-800 hover:text-gray-600">
          <a>{post.title}</a>
        </h2>
      </Link> 
      : <Link href={`/admin/${post.slug}`} legacyBehavior>
      <h2 className="mt-2 text-xl text-gray-800 hover:text-gray-600">
        <a>{post.title}</a>
      </h2>
    </Link> }

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          {post.tags.map((tag : string, index: number) => (
            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-4 text-gray-600">
        <span className="mr-2">
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="text-red-500">❤️ {post.heartCount} Hearts</span>
      </footer>
      <img src={post.imageUrl} alt="img" className="mt-4 w-full h-auto" />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PostFeed = ({ posts, admin }) => {
  if (!posts) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </div>
  );
};

export default PostFeed;
