import { MetadataRoute } from 'next';
import { getAllGolfers } from '@/lib/golfer-data';
import { getAllCourses } from '@/lib/course-data';

const BASE_URL = 'https://birdievantage.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/optimizer`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/strategy`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/scoring`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/golfers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const golferPages: MetadataRoute.Sitemap = getAllGolfers().map((g) => ({
    url: `${BASE_URL}/golfers/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const coursePages: MetadataRoute.Sitemap = getAllCourses().map((c) => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date('2025-12-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...golferPages, ...coursePages];
}
