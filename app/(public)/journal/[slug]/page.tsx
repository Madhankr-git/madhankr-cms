import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getArticleBySlug } from '@/lib/db/articles';
import { markdownToHtml } from '@/lib/utils/markdown';
import ArticleReaderClient from '@/components/public/ArticleReaderClient';

interface ArticlePageProps {
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

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} — MadhanKR Journal`,
    description: article.summary,
    alternates: {
      canonical: `/journal/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: `/journal/${article.slug}`,
      publishedTime: article.published_at,
      tags: article.tags
    }
  };
}

export const revalidate = 3600;

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const htmlContent = await markdownToHtml(article.content);

  return <ArticleReaderClient article={article} htmlContent={htmlContent} />;
}
