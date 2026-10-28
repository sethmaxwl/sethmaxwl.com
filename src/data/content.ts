import { getCollection, type CollectionEntry } from 'astro:content';
import {
  compareByNewestDate,
  compareByTitle,
  orderEntriesByRank,
  selectEntriesByRank,
} from '@utils/contentOrder';

export async function getWorkProjects() {
  return orderEntriesByRank(await getCollection('work'), 'sortOrder', compareByTitle);
}

export async function getFeaturedWorkProjects() {
  return selectEntriesByRank(await getCollection('work'), 'featuredRank', compareByTitle);
}

export async function getBlogPosts() {
  return (await getCollection('blog')).toSorted(compareByNewestDate);
}

export interface ContentListItem {
  href: string;
  title: string;
  description: string;
  date: Date;
  kind?: 'Work Project' | 'Blog Post';
}

export function blogPostListItem(post: CollectionEntry<'blog'>): ContentListItem {
  return {
    href: `/blog/${post.id}/`,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date,
    kind: 'Blog Post',
  };
}

function workProjectListItem(project: CollectionEntry<'work'>): ContentListItem {
  return {
    href: `/work/${project.id}/`,
    title: project.data.title,
    description: project.data.description,
    date: project.data.date,
    kind: 'Work Project',
  };
}

export async function getRecentActivity(limit = 6): Promise<ContentListItem[]> {
  const [projects, posts] = await Promise.all([getFeaturedWorkProjects(), getBlogPosts()]);

  return [...projects.map(workProjectListItem), ...posts.map(blogPostListItem)]
    .toSorted((a, b) => b.date.valueOf() - a.date.valueOf() || a.title.localeCompare(b.title))
    .slice(0, limit);
}
