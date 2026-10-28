import type { CollectionEntry } from 'astro:content';

export function blogSocialImagePath(post: CollectionEntry<'blog'>): string {
  return post.data.coverImage ?? `/og/blog/${post.id}.png`;
}
