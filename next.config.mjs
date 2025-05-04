/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // since we're not implementing a landing page for /monsters
      {
        source: "/monsters",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
