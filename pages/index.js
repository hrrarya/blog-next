import { useQuery, QueryClient } from "react-query";
import { request, gql } from "graphql-request";
import { dehydrate } from "react-query/hydration";
import {
  getLayoutInfo,
  getSiteInfo,
  layoutInfo,
  siteInfo,
} from "../components/lib/layoutInfo";
import Layout from "../components/layout";
import Link from "next/link";

export default function Home() {
  const { data: posts, status, isLoading } = getAllPosts();
  const info = layoutInfo();
  const site = siteInfo();
  // return <h1>Fetching</h1>;
  return isLoading ? (
    <Layout layoutInfo={info} siteInfo={site}>
      <h1 className="text-2xl">Loading</h1>
    </Layout>
  ) : (
    <Layout layoutInfo={info} siteInfo={site}>
      <h1 className="text-5xl m-3">Recent Posts</h1>
      <div className="flex flex-wrap">
        {status === "success" &&
          posts.nodes &&
          posts.nodes.map((post) => (
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
                    <Link href={`posts/${post.slug}`}>
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                    </Link>
                  </a>
                  <div
                    className="post_content w-full"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.slice(0, 100),
                    }}
                  />
                  <Link href={`posts/${post.slug}`}>
                    <a className="text-blue-500 hover:underline inline-block">
                      read more...
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
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

const getAllPosts = () => {
  const data = useQuery("posts", getPost);
  return data;
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("posts", getPost);
  await queryClient.prefetchQuery("menuItems", getLayoutInfo);
  await queryClient.prefetchQuery("generalSettings", getSiteInfo);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
