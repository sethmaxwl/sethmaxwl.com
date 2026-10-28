import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '@data/site';

const require = createRequire(import.meta.url);

const colors = {
  surface: '#fcf7f2',
  ink: '#1c1b1b',
  muted: '#4a4640',
  rule: '#b3a089',
};

function loadFont(file: string) {
  return readFile(require.resolve(file));
}

const fontsPromise = Promise.all([
  loadFont('@fontsource/newsreader/files/newsreader-latin-400-normal.woff'),
  loadFont('@fontsource/public-sans/files/public-sans-latin-500-normal.woff'),
]);

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

function box(style: Record<string, unknown>, children?: unknown) {
  return { type: 'div', props: { style: { display: 'flex', ...style }, children } };
}

function corner(position: 'top-left' | 'bottom-right') {
  const isTopLeft = position === 'top-left';
  const [width, height, inset] = [106, 88, 46];

  // Satori ignores bottom/right offsets, so place both corners from the top-left.
  return box({
    position: 'absolute',
    top: isTopLeft ? inset : 630 - inset - height,
    left: isTopLeft ? inset : 1200 - inset - width,
    width,
    height,
    [isTopLeft ? 'borderTop' : 'borderBottom']: `2px solid ${colors.rule}`,
    [isTopLeft ? 'borderLeft' : 'borderRight']: `2px solid ${colors.rule}`,
  });
}

function titleSize(title: string) {
  if (title.length <= 20) return 104;
  if (title.length <= 40) return 88;
  return 72;
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<'blog'> };
  const [newsreader, publicSans] = await fontsPromise;

  const svg = await satori(
    box(
      {
        position: 'relative',
        width: 1200,
        height: 630,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 120px 0 92px',
        backgroundColor: colors.surface,
      },
      [
        corner('top-left'),
        corner('bottom-right'),
        box(
          {
            fontFamily: 'Newsreader',
            maxWidth: 940,
            fontSize: titleSize(post.data.title),
            lineHeight: 1.08,
            color: colors.ink,
          },
          post.data.title,
        ),
        box(
          {
            marginTop: 36,
            fontFamily: 'Public Sans',
            fontSize: 30,
            letterSpacing: 2,
            color: colors.muted,
          },
          site.name,
        ),
        box({ marginTop: 32, width: 370, borderTop: `2px solid ${colors.rule}` }),
      ],
    ) as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Newsreader', data: newsreader, weight: 400, style: 'normal' },
        { name: 'Public Sans', data: publicSans, weight: 500, style: 'normal' },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
