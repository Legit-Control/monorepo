import type { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/sitemap-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemap();
}
