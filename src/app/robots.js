import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains';

/**
 * Dynamically generate robots.txt content
 * This is more maintainable than a static file and can adapt to different environments
 */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: [
      `${PRIMARY_DOMAIN}/sitemap.xml`,
      `${SECONDARY_DOMAIN}/sitemap.xml`,
    ],
  };
}
