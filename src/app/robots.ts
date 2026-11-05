import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studiospacelive.netlify.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/studios', '/saved-studios'],
        disallow: [
          '/dashboard',
          '/my-listings',
          '/my-bookings',
          '/studios/edit/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

