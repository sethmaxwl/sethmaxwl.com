import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getBlogPosts } from '@data/content';
import { site } from '@data/site';

export const GET: APIRoute = async (context) => {
  const posts = await getBlogPosts();

  return rss({
    title: `${site.name} | Blog`,
    description: 'Short posts about software, projects, and things I’m learning.',
    site: context.site ?? site.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      author: `${site.email} (${site.name})`,
    })),
    customData: '<language>en-us</language>',
  });
};
