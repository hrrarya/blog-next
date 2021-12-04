import { useQuery } from "react-query";
import { request, gql } from "graphql-request";

function layoutInfo() {
  const { data } = useQuery("menuItems", getLayoutInfo);
  return data || [];
}

const getLayoutInfo = async () => {
  const endpoint = process.env.ENDPOINT;
  const menus = await request(
    endpoint,
    gql`
      query {
        header: menuItems(where: { location: PRIMARY }) {
          nodes {
            id
            label
            path
            url
          }
        }
        footer: menuItems(where: { location: FOOTER }) {
          nodes {
            id
            label
            path
            url
          }
        }
      }
    `
  );
  return menus;
};

function siteInfo() {
  const { data } = useQuery("generalSettings", getSiteInfo);
  return data || {};
}

const getSiteInfo = async () => {
  const endpoint = process.env.ENDPOINT;
  const { generalSettings } = await request(
    endpoint,
    gql`
      query {
        generalSettings {
          description
          title
          url
        }
      }
    `
  );
  return generalSettings;
};
function postData(slug) {
  const { data } = useQuery(["postBy", slug], getPostData);
  return data || {};
}
const getPostData = async ({ queryKey }) => {
  const endpoint = process.env.ENDPOINT;
  const slug = queryKey[1];
  const { postBy } = await request(
    endpoint,
    gql`
      query GetPost($slug: String!) {
        postBy(slug: $slug) {
          id
          link
          title(format: RENDERED)
          content
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    `,
    { slug: slug }
  );
  return postBy;
};

export {
  getLayoutInfo,
  layoutInfo,
  getSiteInfo,
  siteInfo,
  postData,
  getPostData,
};
