import type { MetaRecord } from 'nextra';
import type { MetadataRoute } from 'next';

interface RouteInfo {
  href: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

/**
 * Type guard to check if a value has an href property
 */
function hasHref(value: unknown): value is { href: string; type?: string; display?: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'href' in value &&
    typeof (value as { href: unknown }).href === 'string'
  );
}

/**
 * Recursively extracts routes from a MetaRecord
 */
function extractRoutesFromMeta(meta: MetaRecord): RouteInfo[] {
  const routes: RouteInfo[] = [];

  for (const value of Object.values(meta)) {
    // Skip separators and hidden pages
    if (typeof value === 'object' && value !== null) {
      if ('type' in value && value.type === 'separator') {
        continue;
      }
      if ('display' in value && value.display === 'hidden') {
        continue;
      }

      // If it has an href, it's a route
      if (hasHref(value)) {
        const href = value.href;

        // Determine priority and change frequency based on route type
        let priority = 0.5;
        let changeFrequency: RouteInfo['changeFrequency'] = 'monthly';

        // Homepage
        if (href === '/') {
          priority = 1.0;
          changeFrequency = 'weekly';
        }
        // Main docs index
        else if (href === '/docs') {
          priority = 0.9;
          changeFrequency = 'daily';
        }
        // Top-level pages
        else if (href.match(/^\/[^/]+$/)) {
          priority = 0.8;
          changeFrequency = 'weekly';
        }
        // API reference pages (more stable)
        else if (href.startsWith('/docs/api')) {
          priority = 0.6;
          changeFrequency = 'monthly';
        }
        // Other docs pages
        else if (href.startsWith('/docs/')) {
          priority = 0.7;
          changeFrequency = 'weekly';
        }

        routes.push({
          href,
          priority,
          changeFrequency,
        });
      }
    }
  }

  return routes;
}

/**
 * Generates a sitemap from all meta files
 * This function imports all _meta.ts files and extracts routes
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://legitcontrol.com';
  const routes: RouteInfo[] = [];

  // Import all meta files directly
  // This works at build time in Next.js
  const rootMeta = (await import('@/app/_meta')).default as MetaRecord;
  const docsMeta = (await import('@/app/docs/_meta')).default as MetaRecord;
  const conceptsMeta = (await import('@/app/docs/concepts/_meta')).default as MetaRecord;
  const examplesMeta = (await import('@/app/docs/examples/_meta')).default as MetaRecord;
  const reactWrapperMeta = (await import('@/app/docs/react-wrapper/_meta')).default as MetaRecord;
  const apiMeta = (await import('@/app/docs/api/_meta')).default as MetaRecord;

  // Extract routes from each meta file
  if (rootMeta) routes.push(...extractRoutesFromMeta(rootMeta));
  if (docsMeta) routes.push(...extractRoutesFromMeta(docsMeta));
  if (conceptsMeta) routes.push(...extractRoutesFromMeta(conceptsMeta));
  if (examplesMeta) routes.push(...extractRoutesFromMeta(examplesMeta));
  if (reactWrapperMeta) routes.push(...extractRoutesFromMeta(reactWrapperMeta));
  if (apiMeta) routes.push(...extractRoutesFromMeta(apiMeta));

  // Add static routes that might not be in _meta files
  const staticRoutes: RouteInfo[] = [
    { href: '/', priority: 1.0, changeFrequency: 'weekly' },
  ];

  // Combine and deduplicate
  const allRoutes = new Map<string, RouteInfo>();

  // Add static routes first
  for (const route of staticRoutes) {
    allRoutes.set(route.href, route);
  }

  // Add discovered routes (will override static if duplicate, keeping higher priority)
  for (const route of routes) {
    const existing = allRoutes.get(route.href);
    if (!existing || route.priority > existing.priority) {
      allRoutes.set(route.href, route);
    }
  }

  // Convert to sitemap format
  return Array.from(allRoutes.values())
    .map((route) => ({
      url: `${baseUrl}${route.href}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
    .sort((a, b) => b.priority - a.priority); // Sort by priority
}

