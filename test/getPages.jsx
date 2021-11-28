import { useQuery } from "react-query";
import { request, gql } from "graphql-request";

const variable = `{ title: "products" }`;
const endpoint = process.env.ENDPOINT;
const data = useQuery(["pages", variable], async () => {
  const pages = await request(
    endpoint,
    gql`query {
      pages(where: ${variable}) {
        edges {
          node {
            id
            title
          }
        }
      }
    }`
  );
  return pages;
});
