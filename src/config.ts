export const company = __COMPANY__;
export const navigation = [
  { id: 'etusivu', label: 'Etusivu' }, { id: 'palvelut', label: 'Palvelut' },
  { id: 'tyonaytteet', label: 'Työnäytteet' }, { id: 'yhteystiedot', label: 'Yhteystiedot' },
];
export const services = [
  { title: 'Pintaremontti', image: 'utility', alt: 'Harmaa kodinhoitohuone, jossa on pesukone ja kuivausrumpu', description: 'Päivitämme kotisi pintoja ja materiaaleja toiveidesi mukaan siististi ja huolellisesti.' },
  { title: 'Talonmaalaus', image: 'exterior', alt: 'Vaalean puutalon julkisivu kesäisessä pihapiirissä', description: 'Uutta ilmettä ja suojaa talollesi ammattitaidolla.' },
  { title: 'Sisämaalaus', image: 'painting', alt: 'Vihreäksi maalattu huone, maalaustikkaat ja maalipurkki', description: 'Siistit ja kestävät sisämaalaukset kaikkiin tiloihin.' },
  { title: 'Seinän paikkaukset', image: 'wall', alt: 'Seinän tasoitusta lastalla ikkunan vieressä', description: 'Pienet ja isommat seinien korjaukset siististi ja huolellisesti.' },
  { title: 'Saneeraus', image: 'renovation', alt: 'Puutalon sisätila saneerauksen aikana, puiset seinärungot näkyvissä', description: 'Kokonaisvaltaiset saneerausratkaisut kodin eri tiloihin.' },
];
// Original client-supplied photographs. No project locations have been inferred.
export type Project = { title: string; image: string; alt: string; beforeImage?: string; house?: boolean };
export const projects: Project[] = [
  { title: 'Talonmaalaus', image: '/images/tehopiha_talo_paakuva.jpg', alt: 'Musta puutalo, jossa on valkoiset ikkunanpuitteet', house: true },
  { title: 'Pintaremontti', image: '/images/6a045489-0377-423c-a405-6c8915c793f5.jpeg', alt: 'Eteinen, jossa on harmaanruskea seinä, valkoinen tasoitettu alue, vaaleanpunertava panelointi ja puiset ovet' },
  { title: 'Seinän paikkaukset', image: '/images/ad4ba6e3-2797-4eca-9677-b2d69682ab65.jpeg', alt: 'Jälkeen: viimeistelty harmaan ja valkoisen seinäpinnan nurkka', beforeImage: '/images/IMG_3243.jpeg' },
];
