import { QueryClient } from "react-query";
import { request, gql } from "graphql-request";
import { dehydrate } from "react-query/hydration";
import Layout from "../../../components/layout";
import {
  getLayoutInfo,
  getSiteInfo,
  layoutInfo,
  siteInfo,
  getPostData,
  postData,
} from "../../../components/lib/layoutInfo";
import Image from "next/image";

const SinglePost = ({ slug }) => {
  const info = layoutInfo();
  const site = siteInfo();
  const post = postData(slug);
  console.log(post);
  return (
    <Layout layoutInfo={info} siteInfo={site}>
      {post?.featuredImage?.node?.sourceUrl && (
        <Image
          src={post?.featuredImage?.node?.sourceUrl}
          alt={post?.featuredImage?.node?.altText}
          width="512"
          height="512"
        />
      )}
      <div>
        <h1>{post?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
      </div>
    </Layout>
  );
};
export async function getStaticPaths() {
  const posts = await getPost();
  return {
    // paths: [{ params: { title: "hello-world" } }],
    paths: posts?.nodes.map((post) => ({
      params: { slug: post.slug.toString() },
    })),
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  const { params } = context;
  const slug = params.slug;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("menuItems", getLayoutInfo);
  await queryClient.prefetchQuery("generalSettings", getSiteInfo);
  await queryClient.prefetchQuery(["postBy", slug], getPostData);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug: slug,
    },
    revalidate: 1,
  };
}
const getPost = async () => {
  const endpoint = process.env.ENDPOINT;
  const { posts } = await request(
    endpoint,
    gql`
      query {
        posts {
          nodes {
            slug
          }
        }
      }
    `
  );
  return posts;
};
export default SinglePost;
