import { site } from '../data/site.ts';

export interface PageMetadataInput {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  pathname: string;
  siteUrl?: URL;
}

export function resolveSiteUrl(siteUrl?: URL): URL {
  return siteUrl ?? new URL(site.url);
}

export function createPageMetadata({
  title,
  description = site.description,
  image = '/og-image.png',
  type = 'website',
  pathname,
  siteUrl,
}: PageMetadataInput) {
  const baseUrl = resolveSiteUrl(siteUrl);

  return {
    title: title ? `${title} | ${site.name}` : site.defaultTitle,
    description,
    type,
    canonicalUrl: new URL(pathname, baseUrl).href,
    socialImageUrl: new URL(image, baseUrl).href,
  };
}
