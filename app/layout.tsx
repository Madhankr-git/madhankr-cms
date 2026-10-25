import './globals.css';
import type { Metadata } from 'next';
import { getSiteBaseUrl } from '@/lib/utils/seo';
import { getSiteSettings } from '@/lib/db/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = settings?.faviconUrl || '/favicon.ico';
  const siteName = settings?.siteName || 'MadhanKR';
  const siteTagline = settings?.siteTagline || 'Digital Designer & Creative Developer';

  return {
    metadataBase: new URL(getSiteBaseUrl()),
    title: {
      default: `${siteName} — ${siteTagline}`,
      template: `%s | ${siteName}`
    },
    description: settings?.bio || 'Portfolio & articles of MadhanKR. Specializing in UI/UX design, emerging technology, AI workflows, and creative development.',
    icons: {
      icon: [
        { url: favicon },
        { url: favicon, sizes: '32x32' },
        { url: favicon, sizes: '16x16' },
      ],
      shortcut: favicon,
      apple: favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const favicon = settings?.faviconUrl || '/favicon.ico';

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={favicon} id="dynamicSiteFavicon" />
        <link rel="apple-touch-icon" href={favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
