module.exports = {
  reactStrictMode: true,
  images: {
    domains: [`${process.env.DOMAIN}`],
  },
  env: {
    ENDPOINT: process.env.ENDPOINT,
  },
};
