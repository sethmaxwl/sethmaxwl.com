import type { CollectionEntry } from 'astro:content';
import { site } from '../data/site.ts';
import { resolveSiteUrl } from './metadata.ts';

function createPersonStructuredData(siteUrl?: URL) {
  const baseUrl = resolveSiteUrl(siteUrl);
  const homeUrl = new URL('/', baseUrl).href;

  return {
    '@type': 'Person',
    '@id': `${homeUrl}#person`,
    name: site.name,
    url: homeUrl,
    jobTitle: site.person.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: site.person.organization,
    },
    sameAs: [site.links.github, site.links.linkedin],
  };
}

export function createProfilePageStructuredData(siteUrl?: URL) {
  const baseUrl = resolveSiteUrl(siteUrl);
  const homeUrl = new URL('/', baseUrl).href;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${homeUrl}#profile`,
    url: homeUrl,
    name: site.defaultTitle,
    description: site.description,
    mainEntity: createPersonStructuredData(baseUrl),
  };
}

export function createBlogPostStructuredData(post: CollectionEntry<'blog'>, siteUrl?: URL) {
  const baseUrl = resolveSiteUrl(siteUrl);
  const postUrl = new URL(`/blog/${post.id}/`, baseUrl).href;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.date.toISOString(),
    ...(post.data.updatedAt ? { dateModified: post.data.updatedAt.toISOString() } : {}),
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    image: new URL(post.data.coverImage, baseUrl).href,
    author: createPersonStructuredData(baseUrl),
  };
}
