# Mallikuvan analyysi ja toteutus

Ensisijainen ulkoasun lähde: käyttäjän toimittama `TehoPiha Renovation Website Mockup.png`, 941 × 1672 px. Tavoite on mallin toisintaminen. Image-to-code-taidon uusien suunnitelmakuvien yleisohjeesta poikettiin tehtävän nimenomaisen kopiointiohjeen vuoksi: ulkoasua ei suunniteltu uudelleen. Erilliset valokuva-aineistot luotiin ennen varsinaisten sivukomponenttien toteuttamista ja tarkastettiin kuvin. Apple-design-taitoa sovellettiin palautteeseen, fokukseen, typografiseen hierarkiaan ja vähennettyyn liikkeeseen.

## Mittasuhteet

Mallin 941 px leveys vastaa kertoimella 1,53 tavoitteen 1440 px leveyttä. Sisältölinja kulkee noin kohdasta 77 kohtaan 864, joten työpöydän sisältöleveys on 1204 px. Yläpalkin ja pääkuvan sisempi tekstilinja alkaa noin 97 px kohdasta, jolloin työpöytäleveys on 1144 px.

| Osa | Mallin korkeus, noin | Toteutuksen tavoite 1440 px |
|---|---:|---:|
| Yläpalkki | 57 px | 88 px |
| Pääkuva | 311 px | 475 px |
| Palvelut | 326 px | 500 px |
| Luottamusosio | 157 px | 245 px |
| Kuvagalleria | 280 px | noin 460 px, mukaan lukien havainnekuvailmoitus |
| Työvaiheet | 139 px | 215 px |
| Yhteydenotto | 275 px | noin 438 px, mukaan lukien lomakkeen demohuomautus |
| Alatunniste | 128 px | 191 px |

## Visuaalinen järjestelmä

- Valkoinen päätausta, lämmin vaalea `#f5f3f0` työvaiheissa, tummansininen `#1b2833` luottamusosiossa ja alatunnisteessa. Oranssi `#ff510f` kuvakkeissa ja toimintopainikkeissa, otsikkoteksti `#17212d`.
- Roboto muistuttaa mallin tiivistä groteskia. Pääotsikko 64 px / noin 0,96, paino 900 ja negatiivinen kirjainväli. Osio-otsikot 31–40 px. Leipäteksti 15–19 px käyttökohteen mukaan.
- Kolmirivinen vasemmalle tasattu pääotsikko, tumma liukuvärivarjostus kuvan vasemmalla puolella, kaksi rinnakkaista painiketta. Talon kuisti on oikean puolen pääaihe.
- Viisi yhtenäistä palvelukorttia: noin 228 px leveys, 180 px korkea kuva, suora vaalea reunus ja pieni oranssi nuoli. Ei suuria pyöristyksiä tai koristeellisia ulkokehyksiä.
- Luottamusosiossa leveä otsake vasemmalla ja neljä kapeampaa perustelua. Ohuet pystyerottimet ja pyöreät oranssit kuvakepinnat.
- Galleriassa neljä lähes neliömäistä kuvapintaa ja lyhyet kuvatekstit. Demomerkintä lisätään selkeästi.
- Työvaiheissa neljä numeroa ja työkalua esittävää kuvaketta sekä kevyet nuolet. Yhteydenotossa teksti vasemmalla, lomake keskellä ja terassin lähikuva oikealla.
- Painikkeiden kulmasäde 3–4 px, hillityt 180–250 ms hover-tilat, välitön painalluspalaute. Vierityspaljastus on 12 px ja pysähtyy näkyvään tilaan ilman jatkuvaa liikettä.

## Toteutus ja vertailu

Osat toteutettiin oikeina HTML-/React-elementteinä. Mallikuvaa ei käytetä käyttöliittymän taustakuvana eikä tekstejä tai painikkeita leivottu kuviin. Yläpalkin talotunnus on muokattava SVG.

Ensimmäisen selainvertailun jälkeen pääotsikon riviväliä ja pystysijaintia tarkennettiin ja tabletin tiivis viiden kortin asettelu vaihdettiin kahteen sarakkeeseen. Puhelimessa galleria ja työvaiheet ovat kaksipalstaisia, yhteydenotto yksipalstainen ja palvelujen viimeinen kortti kuvallinen vaakarivi. Lomaketestissä havaittu virheilmoituksen aiheuttama painikkeen siirtyminen klikkauksen aikana korjattiin validoinnin ajoituksella.

