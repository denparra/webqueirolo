import { MetadataRoute } from 'next'
import config from '@/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.url

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
