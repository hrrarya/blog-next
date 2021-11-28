import { useQuery, QueryClient, dehydrate } from "react-query";
import { request, gql } from "graphql-request";

export default function Home({ dehydratedState }) {
  const initData = dehydratedState?.queries[0]?.state?.data?.nodes;
  const {
    data: { nodes: posts },
    status,
  } = getAllPosts(initData);
  // return <h1>Fetching</h1>;
  return (
    <div>
      <h1 className="text-5xl m-3">Recent Posts</h1>
      <div className="flex flex-wrap">
        {status === "success" &&
          posts &&
          posts.map((post) => (
            <div key={post.id} className="w-1/4">
              <div key={post.id} className="shadow m-2 rounded">
                {post.featuredImage?.node.sourceUrl ? (
                  <img
                    src={post.featuredImage?.node.sourceUrl}
                    alt={post.featuredImage?.node.altText || "No Featured"}
                    className="w-full h-60 object-cover rounded"
                  />
                ) : (
                  <div className="h-60 w-full bg-pink-100"></div>
                )}
                <div className="p-2">
                  <a href={`posts/${post.slug}`} className="hover:underline">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                  </a>
                  <div
                    className="post_content w-full"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.slice(0, 100),
                    }}
                  />
                  <a
                    href={`posts/${post.slug}`}
                    className="text-blue-500 hover:underline inline-block"
                  >
                    read more...
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const getPost = async () => {
  const endpoint = process.env.ENDPOINT;
  const { posts } = await request(
    endpoint,
    gql`
      query {
        posts {
          nodes {
            id
            title
            slug
            link
            excerpt(format: RENDERED)
            featuredImage {
              node {
                altText
                srcSet
                uri
                sourceUrl
              }
            }
          }
        }
      }
    `
  );
  return posts;
};

const getAllPosts = (posts) => {
  const data = useQuery("posts", getPost, { initialData: posts });
  return data;
};

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("posts", getPost);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
