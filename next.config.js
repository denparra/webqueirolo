/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable instrumentation for Sentry
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['require-in-the-middle'],
    // Margen para la subida de imágenes desde /admin. El default de Server
    // Actions es 1MB; con compresión cliente + sharp en servidor el payload
    // real es mucho menor, pero esto evita un 413 si la capa cliente no corre.
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // Redirects de URLs de la web antigua ("Queirolo Mundo 4x4") al equivalente actual.
  // 301 permanente: recupera autoridad SEO y le indica a Google que la ruta se movió.
  async redirects() {
    return [
      { source: '/stock', destination: '/vehiculos', permanent: true },
      { source: '/stock/:path*', destination: '/vehiculos', permanent: true },
    ]
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
