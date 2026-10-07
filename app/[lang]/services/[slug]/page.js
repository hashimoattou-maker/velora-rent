import { SvcClient } from './svc-client';
export function generateStaticParams() {
  const slugs = ['payments', 'insurance', 'loyalty', 'gift-cards', 'identity', 'companies'];
  return ['fr', 'ar', 'en'].flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}
export default function Page({ params }) { return <SvcClient lang={params.lang} slug={params.slug} />; }
