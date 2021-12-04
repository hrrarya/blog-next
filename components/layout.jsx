import Head from "next/head";
import Footer from "./footer";
import Header from "./menu";

const Layout = ({ layoutInfo, siteInfo: site, children }) => {
  const { header, footer } = layoutInfo;
  return (
    <div>
      <Head>
        <title>
          {site?.titile || "Next Blog"} | {site?.description}
        </title>
        <meta name="description" content={site?.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header headerMenu={header?.nodes} siteInfo={site} />
      {children}
      <Footer footerMenu={footer?.nodes} />
    </div>
  );
};

export default Layout;
