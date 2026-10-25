import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getArticleBySlug } from '@/lib/db/articles';
import { markdownToHtml } from '@/lib/utils/markdown';
import ArticleReaderClient from '@/components/public/ArticleReaderClient';
import { buildArticleMetadata, generateArticleJsonLd } from '@/lib/utils/seo';

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
  if (!article) return { title: 'Article Not Found — MadhanKR' };

  return buildArticleMetadata(article);
}

export const revalidate = 3600;

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const htmlContent = await markdownToHtml(article.content);
  const jsonLd = generateArticleJsonLd(article);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          id={`article-jsonld-${article.id || article.slug}`}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleReaderClient article={article} htmlContent={htmlContent} />
    </>
  );
}
