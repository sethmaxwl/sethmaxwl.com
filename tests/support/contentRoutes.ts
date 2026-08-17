import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

export async function getContentDetailRoutes(): Promise<string[]> {
  const [workRoutes, blogRoutes] = await Promise.all([
    contentRoutes('src/content/work', '/work/'),
    contentRoutes('src/content/blog', '/blog/'),
  ]);

  return [...workRoutes, ...blogRoutes];
}

async function contentRoutes(contentDirectory: string, routePrefix: string): Promise<string[]> {
  const absoluteDirectory = path.join(repoRoot, contentDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `${routePrefix}${entry.name.replace(/\.md$/, '')}/`)
    .toSorted();
}
