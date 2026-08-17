import test from 'node:test';
import assert from 'node:assert/strict';
import type { CollectionEntry } from 'astro:content';
import { createPageMetadata } from '../src/utils/metadata.ts';
import { createBlogPostStructuredData } from '../src/utils/structuredData.ts';

test('createPageMetadata derives titles and absolute public URLs from site metadata', () => {
  const metadata = createPageMetadata({
    title: 'Work',
    pathname: '/work/',
    image: '/images/starred-objects.png',
  });

  assert.deepEqual(metadata, {
    title: 'Work | Seth Maxwell',
    description:
      'Software engineer at Atlassian working on Bitbucket Cloud, frontend architecture, and developer tools.',
    type: 'website',
    canonicalUrl: 'https://sethmaxwl.com/work/',
    socialImageUrl: 'https://sethmaxwl.com/images/starred-objects.png',
  });
});

test('blog structured data only includes dateModified when an update exists', () => {
  const post = {
    id: 'test-post',
    data: {
      title: 'Test post',
      description: 'A test post.',
      date: new Date('2026-05-22T00:00:00.000Z'),
      coverImage: '/og-image.png',
    },
  } as CollectionEntry<'blog'>;

  const publishedSchema = createBlogPostStructuredData(post);
  assert.equal('dateModified' in publishedSchema, false);

  const updatedSchema = createBlogPostStructuredData({
    ...post,
    data: {
      ...post.data,
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    },
  });
  assert.equal(updatedSchema.dateModified, '2026-06-01T00:00:00.000Z');
});
