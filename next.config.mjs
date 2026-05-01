const isGithubPages = process.env.GITHUB_PAGES === 'true';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: isGithubPages ? '/nomad-cafe' : '',
  assetPrefix: isGithubPages ? '/nomad-cafe' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withNextIntl(nextConfig)
