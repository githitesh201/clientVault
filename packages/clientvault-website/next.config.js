/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/user-guide',
        destination: 'https://docs.clientvault.com/user-guide/introduction',
        permanent: true,
      },
      {
        source: '/user-guide/section/:folder/:slug*',
        destination: 'https://docs.clientvault.com/user-guide/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/user-guide/:folder/:slug*',
        destination: 'https://docs.clientvault.com/user-guide/:folder/:slug*',
        permanent: true,
      },

      {
        source: '/developers',
        destination: 'https://docs.clientvault.com/developers/introduction',
        permanent: true,
      },
      {
        source: '/developers/section/:folder/:slug*',
        destination: 'https://docs.clientvault.com/developers/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/developers/:folder/:slug*',
        destination: 'https://docs.clientvault.com/developers/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/developers/:slug',
        destination: 'https://docs.clientvault.com/developers/:slug',
        permanent: true,
      },

      {
        source: '/clientvault-ui',
        destination: 'https://docs.clientvault.com/clientvault-ui/introduction',
        permanent: true,
      },
      {
        source: '/clientvault-ui/section/:folder/:slug*',
        destination: 'https://docs.clientvault.com/clientvault-ui/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/clientvault-ui/:folder/:slug*',
        destination: 'https://docs.clientvault.com/clientvault-ui/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/clientvault-ui/:slug',
        destination: 'https://docs.clientvault.com/clientvault-ui/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
