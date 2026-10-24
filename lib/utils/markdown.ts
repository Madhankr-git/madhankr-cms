import { remark } from 'remark';
import html from 'remark-html';

export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  const result = await remark().use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

export function calculateReadTime(content: string): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
