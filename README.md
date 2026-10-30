# TehoPiha – paikallinen verkkosivudemo

React-, TypeScript- ja Vite-toteutus käyttäjän toimittamasta TehoPiha-mallikuvasta. Mukana Tailwind CSS ja Lucide-kuvakkeet. Sivustoa ei ole julkaistu.

## Käynnistys

Avaa PowerShell projektikansiossa ja suorita:

```powershell
npm ci
npm run dev
```

Jos riippuvuudet ovat jo asennettuina, `npm run dev` riittää. Oletusosoite on http://127.0.0.1:5173/.

```powershell
npm run build
npm run preview
```

Tuotantoversio syntyy `dist/`-kansioon. `npm run preview` näyttää sen paikallisesti, yleensä portissa 4173. Lukitustiedosto tallentaa tarkat käytetyt pakettiversiot.

## Sisällön muokkaaminen

- `src/config.ts`: yhteystiedot, palvelut, valikko ja gallerian esimerkit. Lisää puhelinnumero vasta vahvistuksen jälkeen kenttään `company.phone`.
- `src/main.tsx`: erilliset Header-, Hero-, Services-, WhyChooseUs-, Projects-, Process-, Contact- ja Footer-komponentit sekä saavutettava kuva-/tietoikkuna.
- `src/styles.css`: mallikuvaa vastaava ulkoasu ja mukautukset eri näyttökoille.
- `public/images/`: paikalliset WebP-kuvat. Vaihda gallerian kuvat oikeisiin, luvallisiin asiakaskuviin ja päivitä niiden tekstit ennen referensseinä käyttöä.
- `src/contact.ts`: lomakkeen tarkistus ja eristetty lähetysrajapinta. Toteuta tähän myöhemmin yhteys omaan palvelimeen/webhookiin. GoHighLevel-avaimia ei saa lisätä selainkoodiin.

## Toiminnot

Kiinnittyvä yläpalkki, aktiivisen osion ilmaisin, ankkurilinkit, mobiilivalikko ja Escape-sulkeminen. Palvelukortti esitäyttää tarjouspyynnön aiheen tyhjään viestikenttään. Kuvagalleria toimii myös nuolinäppäimillä ja palauttaa fokuksen sulkemisen jälkeen. Lomakkeessa on kenttäkohtaiset virheet ja fokus ensimmäiseen virheelliseen kenttään.

Hienovaraiset aloitus- ja vieritysanimaatiot sekä painikkeiden ja kuvien vuorovaikutukset huomioivat vähennetyn liikkeen, läpinäkyvyyden ja suuremman kontrastin asetukset. Sivun fontitkin latautuvat paikallisesti.

## Ennen julkaisua

Lomake ei lähetä eikä tallenna tietoja. Lähetyksen kokeileminen näyttää tämän selvästi; käyttäjä voi erikseen avata luonnoksen omaan sähköpostiohjelmaansa. Lomake ei väitä viestin lähteneen.

Kuvat ovat tekoälyllä luotuja havainnekuvia, eivät TehoPihan toteutuneita asiakaskohteita. Puhelinnumeroa, asiakasarvioita tai kokemustietoja ei ole keksitty. Tietosuojatiedot ovat demoa kuvaavia; lopullinen rekisterinpitäjä, käsittelyperusteet ja käytännöt pitää vahvistaa ennen oikean lomakkeen käyttöönottoa. Demo käyttää `noindex, nofollow` -asetusta. Tarkista lopullinen sisältö ja poista asetus vasta julkaisuvaiheessa.

## Tarkistus

Tuotantokäännös on tarkistettu. Selainkokeissa tarkistettiin navigointi, palvelukortin esitäyttö, kuvagalleria ja näppäimistökäyttö, molemmat tietodialogit, lomakkeen virhetilat, yhteydetön lähetys, mobiilivalikko ja animaatiot. Vaakasuoraa ylivuotoa ei todettu leveyksillä 1440, 1024, 768, 390 tai 320 pikseliä. Katso `verification.json`.

Ulkoasu tarkistettiin kuvatallenteista leveyksillä 1440, 1024, 768 ja 390. `preview-1440.png` ja `preview-390.png` näyttävät työpöytä- ja puhelinversion. Valokuvat ja pieni demosisällön ilmoitus poikkeavat alkuperäisestä mallista; toteutus säilyttää osiot, sommittelun ja värimaailman.

