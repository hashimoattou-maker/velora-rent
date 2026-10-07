import '../globals.css';
import { StoreProvider } from '@/lib/store';
export default function LangLayout({ children, params }) {
  const lang = params?.lang || 'fr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={lang} dir={dir}>
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
export function generateStaticParams() { return [{ lang: 'fr' }, { lang: 'ar' }, { lang: 'en' }]; }
