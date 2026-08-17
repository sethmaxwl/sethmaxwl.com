import { getCollection } from 'astro:content';
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
