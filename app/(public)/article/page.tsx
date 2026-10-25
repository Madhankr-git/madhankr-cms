import { permanentRedirect } from 'next/navigation';

export default function ArticleRootPage() {
  permanentRedirect('/articles');
}
