const wordsPerMinute = 230;

export function readingTimeMinutes(markdown: string): number {
  const prose = markdown.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
  const words = prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;

  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function formatReadingTime(markdown: string): string {
  return `${readingTimeMinutes(markdown)} min read`;
}
