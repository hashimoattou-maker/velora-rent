import { DetailClient } from './detail-client';
export function generateStaticParams() {
  const ids = ['dacia-logan','dacia-duster','clio-5','peugeot-208','golf-8','tucson','mercedes-c','range-evoque','toyota-hiace','tesla-3','kia-picanto','bmw-x3'];
  return ['fr','ar','en'].flatMap((lang) => ids.map((id) => ({ lang, id })));
}
export default function Page({ params }) { return <DetailClient lang={params.lang} id={params.id} />; }
