import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains';

export default function sitemap() {
  
  // Define the static routes for both domains
  return [
    {
      url: PRIMARY_DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: SECONDARY_DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8, // Lower priority for secondary domain
    },
    // Note: For dynamic student routes, we can't pre-generate them all
    // as they're created on-demand based on student IDs
  ];
}
