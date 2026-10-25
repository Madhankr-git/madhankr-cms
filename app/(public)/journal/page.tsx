import { permanentRedirect } from 'next/navigation';

export default function LegacyJournalPage() {
  permanentRedirect('/articles');
}
