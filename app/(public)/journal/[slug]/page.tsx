import { permanentRedirect } from 'next/navigation';
import { getPublishedArticles } from '@/lib/db/articles';

interface LegacyJournalProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function LegacyJournalArticlePage({ params }: LegacyJournalProps) {
  permanentRedirect(`/article/${params.slug}`);
}
