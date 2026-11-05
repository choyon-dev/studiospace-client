import type { MetadataRoute } from 'next';
import { slugify } from '@/lib/slug';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studiospacelive.netlify.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://studiospace-server-c4j2.onrender.com/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/studios`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/add-studio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/saved-studios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${API_URL}/studios`, { next: { revalidate: 3600 } });
    if (!res.ok) return staticRoutes;
    const data = await res.json();
    const studios = Array.isArray(data) ? data : data?.studios || [];

    const studioUrls: MetadataRoute.Sitemap = studios.map((s: any) => {
      const slug = s.slug || slugify(s.title) || s._id;
      return {
        url: `${BASE_URL}/studios/${slug}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...studioUrls];
  } catch {
    return staticRoutes;
  }
}
