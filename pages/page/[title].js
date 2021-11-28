const Page = (props) => {
  return (
    <div>
      <h1>hello from page</h1>
    </div>
  );
};

export async function getStaticProps(context) {
        const title = context.params.title
          .replace("/", "")
          .replace("-", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      
  const res = await fetch("http://localhost:10003/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query MyQuery {
        pages(where: {title: ${title}) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
    }),
  });
  const json = await res.json();

  return {
    props: {
      page: json.data.pages.edges,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:10003/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query MyQuery {
        pages {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
    }),
  });
  const json = await res.json();

  const pages = json.data.pages.edges;

  const paths = pages.map((page) => ({
    params: { title: page.node.title },
  }));

  return { paths, fallback: false };
}

export default Page;
