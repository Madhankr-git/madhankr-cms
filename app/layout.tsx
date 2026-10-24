import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://madhankumarrajagopal.netlify.app'),
  title: {
    default: 'MadhanKR — Digital Designer & Creative Developer',
    template: '%s | MadhanKR'
  },
  description: 'Portfolio & personal journal of MadhanKR. Specializing in UI/UX design, emerging technology, AI workflows, and creative development.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
