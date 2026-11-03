import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { FormEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, MapPin, CircleCheck, MessageCircle, FileText, Hammer, House, Mail, Phone, Menu, X, ChevronLeft, ChevronRight, UsersRound } from 'lucide-react';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-500-italic.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/roboto/latin-900.css';
import { company, navigation, services, projects } from './config';
import { validateContact, submitContact } from './contact';
import type { ContactFields, ContactErrors } from './contact';
import { trackSuccessfulQuotation } from './analytics';
import { CookieConsent } from './CookieConsent';
import './styles.css';

function Logo({ footer = false }: { footer?: boolean }) {
  return <a className={`logo ${footer ? 'logo-footer' : ''}`} href="#etusivu" aria-label={`${company.displayName} – etusivu`}>
    <img src={company.logo} alt="" width="300" height="300" />
    <span className="logo-wordmark">Teho<span>Piha</span></span>
  </a>;
}
function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p>; }
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('etusivu');
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let id = 'etusivu';
      for (const item of navigation) if ((document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 160) id = item.id;
      setActive(id);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) { setOpen(false); trigger.current?.focus(); } };
    const resize = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener('keydown', close); window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);
  return <header className={`header ${scrolled ? 'scrolled' : ''}`}><div className="header-inner">
    <Logo />
    <nav id="main-navigation" aria-label="Päävalikko" className={open ? 'navigation open' : 'navigation'}>
      {navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} aria-current={active === item.id ? 'location' : undefined}>{item.id === 'tyonaytteet' ? 'Referenssit' : item.label}</a>)}
      <a href="#yhteystiedot" className="button mobile-quote" onClick={() => setOpen(false)}>Pyydä tarjous</a>
    </nav>
    <a className="button header-quote" href="#yhteystiedot">Pyydä tarjous</a>
    <button className="menu-toggle" ref={trigger} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}>{open ? <X /> : <Menu />}</button>
  </div></header>;
}
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const entranceRef = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(heroRef.current);
      // No image transform: the approved composition and crop stay fixed.
      const entrance = gsap.timeline({ defaults: { ease: 'power2.out' } });
      entranceRef.current = entrance;
      entrance
        .from(select('.hero-image'), { opacity: 0.94, duration: 0.85, clearProps: 'opacity' }, 0)
        .from(select('.hero-kicker'), { opacity: 0, y: 8, duration: 0.55, clearProps: 'opacity,transform' }, 0.05)
        .fromTo(select('.hero-kicker'), { '--hero-line-reveal': 0 }, { '--hero-line-reveal': 1, duration: 0.55, clearProps: '--hero-line-reveal' }, 0.12)
        .from(select('h1'), { opacity: 0, y: 12, duration: 0.68, clearProps: 'opacity,transform' }, 0.12)
        .from(select('.hero-description'), { opacity: 0, y: 8, duration: 0.55, clearProps: 'opacity,transform' }, 0.28)
        .from(select('.hero-actions'), { opacity: 0, y: 8, duration: 0.55, clearProps: 'opacity,transform' }, 0.4)
        .from(select('.hero-audience'), { opacity: 0, y: 6, duration: 0.55, clearProps: 'opacity,transform' }, 0.5)
        .from(select('.hero-review'), { opacity: 0, y: 6, duration: 0.55, clearProps: 'opacity,transform' }, 0.65);
      return () => { entranceRef.current = null; };
    }, heroRef.current!);
    return () => media.revert();
  }, []);
  useEffect(() => {
    const header = document.querySelector('.header');
    if (!header) return;
    const measure = () => heroRef.current?.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return <section ref={heroRef} id="etusivu" className="hero hero-reference" aria-labelledby="hero-heading" onFocusCapture={() => entranceRef.current?.progress(1)}>
    <img className="hero-image" src={`${import.meta.env.BASE_URL}images/hero.webp`} alt="Kuvituskuva: vaalea suomalainen puutalo, puuterassi ja vehreä kesäpiha" fetchPriority="high" width="1536" height="1024" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-inner">
      <p className="hero-kicker">PAIKALLISTA OSAAMISTA</p>
      <h1 id="hero-heading">Remontit ja<br />saneeraukset<br /><span>Nurmijärvellä</span></h1>
      <p className="hero-description">Teemme pintaremontteja, maalaustöitä ja muita saneeraustöitä huolellisesti Nurmijärvellä ja lähialueilla.</p>
      <div className="hero-actions"><a href="#yhteystiedot" className="button">Pyydä tarjous <ArrowRight size={19} /></a><a href="#palvelut" className="button button-outline">Katso palvelut</a></div>
      <div className="hero-audience"><span className="hero-audience-icon" aria-hidden="true"><UsersRound size={28} strokeWidth={1.8} /></span><div><h3>Yksityisille ja yrityksille</h3><p>Samat korkeat laatuvaatimukset kaikille asiakkaillemme.</p></div></div>
      <figure className="hero-review">
        <div className="hero-review-rating"><span className="hero-review-stars" role="img" aria-label="5 tähteä viidestä">★★★★★</span><span className="hero-review-source">Google-arvostelu</span></div>
        <blockquote>”Nopea kommunikointi, erinomainen palvelu ja työn lopputulos oli enemmän kuin tarvitsimme!”</blockquote>
        <figcaption><span className="hero-review-avatar" aria-hidden="true">S</span><span>Santeri Lehtinen</span></figcaption>
      </figure>
    </div>
  </section>;
}
function Services({ choose }: { choose: (service: string) => void }) {
  return <section id="palvelut" className="services section" aria-labelledby="services-heading"><div className="container">
    <div className="section-heading reveal"><div><Eyebrow>Palvelumme</Eyebrow><h2 id="services-heading">Remontointia kodin eri tarpeisiin</h2></div><p>Tarjoamme laadukkaita remontti- ja maalauspalveluita Nurmijärvellä ja lähialueilla. Oli kyseessä pieni päivitys tai laajempi saneeraus, autamme mielellämme.</p></div>
    <div className="services-grid">{services.map((service, index) => <a key={service.title} className="service-card reveal" style={{ '--delay': `${index * 55}ms` } as React.CSSProperties} href="#yhteystiedot" onClick={() => choose(service.title)} aria-label={`${service.title} – pyydä tarjous`}>
      <div className="service-image"><img src={`${import.meta.env.BASE_URL}images/${service.image}.webp`} alt={service.alt} loading="lazy" width="560" height="420" /></div>
      <div className="service-copy"><h3>{service.title}</h3><p>{service.description}</p><ArrowRight className="card-arrow" size={25} aria-hidden="true" /></div>
    </a>)}</div>
  </div></section>;
}
const benefits = [
  { icon: MapPin, title: <>Paikallinen toimija<br />Nurmijärveltä</>, text: 'Tunnemme alueen ja paikalliset kodit.' },
  { icon: CircleCheck, title: <>Huolellinen<br />työnjälki</>, text: 'Laatu ja viimeistely ovat meille tärkeitä.' },
  { icon: MessageCircle, title: <>Selkeä<br />kommunikointi</>, text: 'Pidämme sinut ajan tasalla koko projektin ajan.' },
  { icon: FileText, title: <>Tarjous ilman<br />turhaa säätöä</>, text: 'Saat selkeän tarjouksen nopeasti ja ymmärrettävästi.' },
];
function WhyChooseUs() { return <section className="trust" aria-labelledby="trust-heading"><div className="container trust-grid">
  <div className="trust-heading reveal"><Eyebrow>Miksi TehoPiha?</Eyebrow><h2 id="trust-heading">Luotettava remonttikumppani Nurmijärvellä</h2></div>
  {benefits.map(({ icon: Icon, title, text }, index) => <div className="benefit reveal" key={text} style={{ '--delay': `${index * 55}ms` } as React.CSSProperties}><span className="icon-circle"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></div>)}
</div></section>; }
function ProjectMedia({ project }: { project: (typeof projects)[number] }) {
  if (project.beforeImage) return <div className="project-image project-comparison">
    <span className="comparison-half"><img src={project.beforeImage} alt={project.beforeAlt ?? 'Ennen: keskeneräinen, epätasainen seinän sauma'} loading="lazy" /><span className="comparison-label">ENNEN</span></span>
    <span className="comparison-half"><img src={project.image} alt={project.alt} loading="lazy" /><span className="comparison-label">JÄLKEEN</span></span>
  </div>;
  return <div className={`project-image${project.house ? ' project-house' : ''}`}><img src={project.image} alt={project.alt} loading="lazy" /></div>;
}
function Projects({ view }: { view: (index: number) => void }) { return <section id="tyonaytteet" className="projects section" aria-labelledby="projects-heading"><div className="container">
  <div className="projects-heading reveal"><div><Eyebrow>Työnäytteitä</Eyebrow><h2 id="projects-heading">Referenssit</h2></div><button className="text-link" onClick={() => view(0)}>Katso kuvat tarkemmin <ArrowRight size={19} /></button></div>
  <p className="demo-caption">Kuvia TehoPihan toteuttamista töistä.</p>
  <div className="projects-grid">{projects.map((project, index) => <button className="project reveal" key={project.title} onClick={() => view(index)} style={{ '--delay': `${index * 55}ms` } as React.CSSProperties} aria-label={`Avaa työkuva: ${project.title}`}>
    <ProjectMedia project={project} /><span className="project-title">{project.title}</span>
  </button>)}</div>
</div></section>; }
const steps = [
  { icon: MessageCircle, title: 'Ota yhteyttä', text: 'Kerro lyhyesti projektistasi ja toiveistasi.' },
  { icon: FileText, title: 'Kartoitus ja tarjous', text: 'Käymme kohteen läpi ja saat selkeän tarjouksen.' },
  { icon: Hammer, title: 'Työn toteutus', text: 'Sovimme aikataulun ja teemme työn huolellisesti.' },
  { icon: House, title: 'Valmis lopputulos', text: 'Saat valmiin, siistin ja laadukkaan lopputuloksen.' },
];
function Process() { return <section className="process" aria-labelledby="process-heading"><div className="container process-grid">
  <div className="reveal"><Eyebrow>Näin työ etenee</Eyebrow><h2 id="process-heading">Selkeä prosessi <br />alusta loppuun</h2></div>
  <ol className="steps">{steps.map(({ icon: Icon, title, text }, index) => <li className="step reveal" key={title} style={{ '--delay': `${index * 70}ms` } as React.CSSProperties}>
    <div className="step-symbols"><span className="step-number">{index + 1}</span><span className="step-icon"><Icon size={25} /></span>{index < 3 && <ArrowRight className="step-connector" size={24} />}</div><h3>{title}</h3><p>{text}</p>
  </li>)}</ol>
</div></section>; }
const emptyFields: ContactFields = { name: '', email: '', phone: '', location: '', message: '' };
function Contact({ chosen }: { chosen: string }) {
  const [values, setValues] = useState<ContactFields>(emptyFields);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'busy' | 'success' | 'error'>('idle');
  const sending = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (chosen) { setValues(v => ({ ...v, message: v.message || `Olen kiinnostunut palvelusta: ${chosen}. ` })); setStatus('idle'); } }, [chosen]);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending.current) return;
    const next = validateContact(values); setErrors(next); setStatus('idle');
    const key = Object.keys(next)[0];
    if (key) { form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(); return; }
    sending.current = true; setStatus('busy');
    try {
      const result = await submitContact(values);
      setStatus(result.status);
      if (result.status === 'success') { setValues(emptyFields); setErrors({}); trackSuccessfulQuotation(); }
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };
  const field = (name: keyof ContactFields, label: string, type = 'text', required = false) => {
    const shared = { id: `contact-${name}`, name, required, disabled: status === 'busy', value: values[name], 'aria-invalid': errors[name] ? true as const : undefined, 'aria-describedby': errors[name] ? `error-${name}` : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const next = { ...values, [name]: e.target.value }; setValues(next); setStatus('idle'); if (errors[name]) setErrors(prev => ({ ...prev, [name]: validateContact(next)[name] })); },
      // Let submit validate when focus moves to its button: inserting an error during
      // pointer-down would move the button before pointer-up and cancel the click.
      onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.relatedTarget instanceof HTMLButtonElement && event.relatedTarget.type === 'submit') return;
        setErrors(prev => ({ ...prev, [name]: validateContact(values)[name] }));
      }, maxLength: name === 'message' ? 4000 : 180 };
    return <div className="field"><label htmlFor={shared.id}>{label}{required && <span className="required"> *</span>}</label>{name === 'message' ? <textarea {...shared} rows={3} placeholder="Esim. kodinhoitohuoneen remontti, maalaus, aikataulu…" /> : <input {...shared} type={type} placeholder={name === 'location' ? 'Esim. Klaukkala, Nurmijärvi tai 01800' : undefined} autoComplete={{ name: 'name', email: 'email', phone: 'tel', location: 'off', message: 'off' }[name]} />}{errors[name] && <p id={`error-${name}`} className="field-error">{errors[name]}</p>}</div>;
  };
  return <section id="yhteystiedot" className="contact" aria-labelledby="contact-heading"><div className="contact-photo"><img src={`${import.meta.env.BASE_URL}images/contact.webp`} alt="Valkoisia kukkia ruukussa suomalaisen puutalon terassiportailla" width="1086" height="1448" loading="lazy" /></div><div className="container contact-grid">
    <div className="contact-copy reveal"><Eyebrow>Ota yhteyttä</Eyebrow><h2 id="contact-heading">Pyydä tarjous</h2><p>Kerro meille kohteestasi. Vastaamme mielellämme kysymyksiisi ja sovimme maksuttoman kartoituskäynnin, mikäli kohde sitä vaatii.</p>
      <dl className="contact-details"><div><dt><span className="icon-circle"><House size={23} /></span>Yritys</dt><dd>{company.officialName}</dd></div><div><dt><span className="icon-circle"><MapPin size={23} /></span>Sijainti</dt><dd>{company.locality}</dd></div>{company.phone && <div><dt><span className="icon-circle"><Phone size={23} /></span>Puhelin</dt><dd><a href={`tel:${company.phoneHref}`}>{company.phone}</a></dd></div>}<div><dt><span className="icon-circle"><Mail size={23} /></span>Sähköposti</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div></dl>
    </div>
    <form ref={form} className="contact-form reveal" onSubmit={onSubmit} noValidate aria-label="Tarjouspyyntö">
      {field('name', 'Nimi', 'text', true)}{field('email', 'Sähköposti', 'email', true)}{field('phone', 'Puhelin', 'tel')}{field('location', 'Remonttikohteen sijainti', 'text', true)}{field('message', 'Kerro lyhyesti projektistasi', 'text', true)}
      <button className="button submit-button" type="submit" disabled={status === 'busy'}>{status === 'busy' ? 'Lähetetään...' : 'Lähetä viesti'}<ArrowRight size={19} /></button>
      <div className="form-status" role="status" aria-live="polite">{status === 'success' && <p>Kiitos yhteydenotostasi! Tarjouspyyntösi on lähetetty onnistuneesti. Otamme sinuun yhteyttä mahdollisimman pian.</p>}{status === 'error' && <p>Viestin lähettäminen epäonnistui. Yritä uudelleen tai ota yhteyttä sähköpostitse: <a href={`mailto:${company.email}`}>tehopiha@gmail.com</a>.</p>}</div>
    </form>
  </div></section>;
}
function Footer({ legal, cookieSettings }: { legal: (type: 'privacy' | 'cookies') => void; cookieSettings: () => void }) { return <footer className="footer"><div className="container footer-grid">
  <div><Logo footer /><p className="official-company">{company.officialName}</p><p className="business-id">Y-tunnus: {company.businessId}</p><p>Remontit ja saneeraukset Nurmijärvellä</p></div><div className="footer-links"><h3>Pikalinkit</h3><nav aria-label="Alatunnisteen valikko">{navigation.map(item => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}</nav></div><div className="footer-contact"><h3>Yhteystiedot</h3><p><MapPin size={16} />{company.locality}</p><a href={`mailto:${company.email}`}><Mail size={16} />{company.email}</a>{company.phone && <a href={`tel:${company.phoneHref}`}><Phone size={16} />{company.phone}</a>}<h3 style={{ marginTop: 16 }}>Yhteyshenkilöt</h3><p>Eemeli Mouhu</p><p>Noora Asikainen</p></div>
  </div><div className="footer-bottom"><div className="container"><p>© {new Date().getFullYear()} {company.officialName}. Kaikki oikeudet pidätetään.</p><div><button onClick={() => legal('privacy')}>Tietosuojaseloste</button><button onClick={() => legal('cookies')}>Evästekäytäntö</button><button onClick={cookieSettings}>Evästeasetukset</button></div></div><p className="footer-credit">Sivuston toteutus: <a href="https://aatosmarketing.fi/">Aatos Marketing</a></p></div>
</footer>; }
type Modal = { type: 'gallery'; index: number } | { type: 'privacy' | 'cookies' } | null;
function SiteDialog({ modal, close, navigate }: { modal: Modal; close: () => void; navigate: (index: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (modal && !ref.current?.open) ref.current?.showModal();
    else if (!modal && ref.current?.open) ref.current.close();
  }, [modal]);
  const project = modal?.type === 'gallery' ? projects[modal.index] : undefined;
  return <dialog ref={ref} className={`site-dialog ${project ? 'gallery-dialog' : ''}`} aria-labelledby="dialog-title" onCancel={close} onClick={event => { if (event.target === ref.current) { const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }} onKeyDown={event => { if (modal?.type === 'gallery' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); navigate((modal.index + (event.key === 'ArrowRight' ? 1 : projects.length - 1)) % projects.length); } }}>
    <button className="dialog-close" onClick={close} aria-label="Sulje ikkuna" autoFocus><X /></button>
    {project && modal?.type === 'gallery' ? <><ProjectMedia project={project} /><div className="dialog-copy"><Eyebrow>Työkuva · {modal.index + 1} / {projects.length}</Eyebrow><h2 id="dialog-title">{project.title}</h2>{project.beforeImage && <p className="legal-note">Kuvat on otettu eri etäisyyksiltä ja eri kulmista.</p>}<div className="gallery-controls"><button className="button button-light" onClick={() => navigate((modal.index + projects.length - 1) % projects.length)} aria-label="Edellinen kuva"><ChevronLeft /> Edellinen</button><button className="button button-light" onClick={() => navigate((modal.index + 1) % projects.length)} aria-label="Seuraava kuva">Seuraava <ChevronRight /></button></div></div></> : <div className="dialog-copy"><Eyebrow>TehoPiha Tmi</Eyebrow><h2 id="dialog-title">{modal?.type === 'privacy' ? 'Tietosuoja' : 'Evästekäytäntö'}</h2>{modal?.type === 'privacy' ? <>
      <p><strong>Rekisterinpitäjä.</strong> TehoPiha Tmi, Y-tunnus 3611223-1, vastaa tehopiha.fi-sivuston yhteydenottojen henkilötietojen käsittelystä. Yhteys ja tietosuojapyynnöt: <a href="mailto:tehopiha@gmail.com">tehopiha@gmail.com</a>. Päivitetty 3.11.2026.</p>
      <p><strong>Tiedot ja käyttötarkoitus.</strong> Lomakkeella kerätään nimi, sähköpostiosoite, vapaaehtoinen puhelinnumero, remonttikohteen yleinen sijainti ja projektikuvaus. Tietoja käytetään tiedusteluihin vastaamiseen ja tarjousten valmisteluun. Tarkkaa katuosoitetta tai arkaluonteisia tietoja ei tarvita. Pakolliset kentät tarvitaan lomakkeen lähettämiseen; voit myös ottaa yhteyttä sähköpostitse.</p>
      <p><strong>Oikeusperuste.</strong> Yksityishenkilön oma tarjouspyyntö käsitellään hänen pyytämien sopimusta edeltävien toimenpiteiden toteuttamiseksi (GDPR 6(1)(b)). Muissa tiedusteluissa ja yritysten yhteyshenkilöiden osalta arvioitava peruste on oikeutettu etu: yhteydenottoihin vastaaminen ja liikesuhteiden hoitaminen (6(1)(f)). TehoPihan on dokumentoitava tätä koskeva etujen punninta. Lomakkeeseen ei liity automaattista päätöksentekoa, profilointia tai markkinointilistalle liittämistä.</p>
      <p><strong>Palveluntarjoajat ja pääsy tietoihin.</strong> Web3Forms (Web3Creative) käsittelee lomakelähetyksiä ja välittää ne HTTPS-yhteyden kautta TehoPihan Gmail-sähköpostiin. Google tarjoaa vastaanottavan sähköpostipalvelun. Aatos Marketing ylläpitää sivustoa ja hallinnoi Web3Forms-tiliä TehoPihan puolesta; pääsy henkilötietoihin rajataan ylläpidon ja integraation hoitamisen kannalta tarpeelliseen. TehoPihan ja Aatos Marketingin käsittelyjärjestely, ohjeet, käyttöoikeudet ja palveluntarjoajaketju on dokumentoitava henkilötietojen käsittelysopimuksella. Sopimuksen voimassaoloa ei tässä vahvisteta.</p>
      <p>Web3Forms ilmoittaa käyttävänsä AWS:n, Cloudflaren ja Hetznerin infrastruktuuria sekä CleanTalk- ja Akismet-roskapostisuojausta. Suojauspalveluille voidaan välittää IP- ja sähköpostiosoite. Palvelu voi käsitellä myös lähetysajankohtaa ja muita teknisiä tietoja. Katso <a href="https://web3forms.com/privacy">Web3Formsin tietosuojakäytäntö</a> ja <a href="https://web3forms.com/dpa">käsittelysopimus</a>.</p>
      <p><strong>Säilytys.</strong> Web3Formsin hallinnassa on valittu yli vuoden vanhojen lähetysten poistaminen. Palvelun tietosuojakäytäntö sallii lyhyemmän säilytysajan, mutta sen DPA:n kohta 8 mainitsee kolmen vuoden fyysisen time-to-live-ajan. Siksi yhden vuoden asetuksesta ei voida päätellä kaikkien kopioiden poistuvan vuodessa. Asetuksen vaikutus fyysisiin tietoihin, lokeihin ja varmuuskopioihin odottaa Web3Formsin vahvistusta.</p>
      <p>Gmailiin toimitetuilla viesteillä on erillinen säilytyskäytäntö. Ehdotus on poistaa asiakkuuteen johtamattomat tarjouspyynnöt 12 kuukauden kuluessa viimeisestä asiaan liittyvästä yhteydenotosta, ellei muulle säilyttämiselle ole perusteltua oikeudellista tarvetta. Ehdotus odottaa yrittäjän vahvistusta eikä sitä esitetä jo käytössä olevana poistokäytäntönä. Asiakassopimuksiin, laskuihin ja lakisääteisiin liiketoiminta-asiakirjoihin voi soveltua eri säilytysvelvoitteita; vuoden asetusta ei sovelleta niihin yleisenä määräaikana.</p>
      <p><strong>Hosting ja kansainväliset siirrot.</strong> GitHub Pages ylläpitää sivustoa ja kirjaa kävijän IP-osoitteen turvallisuustarkoituksiin. Kyse on palvelinlokista, ei selaimen evästeestä. Katso <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHubin tietosuojalausunto</a>. Web3Creative toimii Intiassa ja palveluntarjoajat voivat käsitellä tietoja EU-/ETA-alueen ulkopuolella. Web3Formsin DPA ilmoittaa soveltavansa EU:n vakiosopimuslausekkeita siirtoihin. TehoPihan ja Aatos Marketingin sopimusketjun sekä Gmailin ja GitHubin soveltuvien ehtojen ja siirtoperusteiden dokumentointi on vielä vahvistettava. Pelkkä palveluntarjoajan ilmoitus ei vahvista TehoPihan omien velvoitteiden täyttymistä.</p>
      <p><strong>Valinnainen kävijäanalytiikka.</strong> Käytämme vain suostumuksellasi Google Analytics 4 -palvelua (Google Ireland Limited / Google LLC) sivuston käytön ja tarjouspyyntöjen määrän ymmärtämiseen. Oikeusperuste on suostumus (GDPR 6(1)(a)). Mittaus voi sisältää evästeeseen tallennetun selaintunnisteen, sivukatselun, käynti- ja istuntotietoja, yleisiä käyttötapahtumia kuten vierityksen, laitteen ja selaimen tietoja sekä IP-osoitteesta pääteltävän karkean sijainnin. Google kertoo, ettei se tallenna EU-kävijöiden IP-osoitteita Analyticsiin. Onnistunut tarjouspyyntö mitataan vain Web3Formsin vahvistuksen jälkeen tapahtumana ilman lomakekenttien tietoja. Emme lähetä Googlelle nimiä, sähköposteja, puhelinnumeroita, kohteen sijaintia tai projektikuvausta. Mittaukseen ei välitetä sivun osoitteen kyselyparametreja, ankkureita tai tulosivun viittaajaa. Mainonnan personointi ja Google signals on estetty tässä toteutuksessa.</p>
      <p>Google ei lataudu ennen analytiikan hyväksymistä. Voit kieltäytyä tai perua suostumuksesi milloin tahansa alatunnisteen Evästeasetuksista. Peruminen lopettaa tämän sivun mittauksen ja poistaa tämän sivuston analytiikkaevästeet; se ei poista jo toimitettuja tietoja eikä vaikuta ennen perumista tehdyn käsittelyn lainmukaisuuteen. Palvelua voi käyttää ilman analytiikkaa. Google voi käsitellä tietoja myös EU-/ETA-alueen ulkopuolella, muun muassa Yhdysvalloissa. Google kuvaa siirtoperusteinaan muun muassa EU–USA-tietosuojakehystä ja vakiosopimuslausekkeita; TehoPihan Analytics-tiliin soveltuvat käsittelyehdot ja siirtoperuste on vahvistettava ennen käyttöönottoa. Analyticsin käyttäjä- ja tapahtumatietojen säilytys riippuu tilin asetuksesta (tavallisessa GA4-palvelussa 2 tai 14 kuukautta), jota ei ole tässä vahvistettu. Asetus ei kata kaikkia koottuja raportteja. Selaimen analytiikkaevästeille asetetaan tässä toteutuksessa enintään 180 päivän kesto, ja suostumusvalinta muistetaan enintään 180 päivää. Katso <a href="https://policies.google.com/technologies/partner-sites">Googlen tietosuojatiedot</a>, <a href="https://policies.google.com/privacy/frameworks">kansainväliset siirrot</a> ja <a href="https://support.google.com/analytics/answer/7667196">Analyticsin säilytysajat</a>.</p>
      <p><strong>Oikeutesi.</strong> Voit pyytää pääsyä tietoihisi, niiden oikaisua, poistamista tai käsittelyn rajoittamista. Oikeutettuun etuun perustuvaa käsittelyä voi vastustaa. Sopimukseen perustuvassa automaattisessa käsittelyssä on lain edellytyksin oikeus tietojen siirtämiseen. Oikeuksien soveltuminen riippuu käsittelyn perusteesta ja mahdollisista säilytysvelvoitteista. Ota yhteyttä osoitteeseen <a href="mailto:tehopiha@gmail.com">tehopiha@gmail.com</a>. Voit myös tehdä valituksen <a href="https://tietosuoja.fi/">tietosuojavaltuutetun toimistolle</a>.</p>
    </> : <>
      <p>Päivitetty 3.11.2026. Sivuston valinnainen Google Analytics 4 -analytiikka on oletuksena pois päältä. Googlelta ei ladata analytiikkaskriptejä tai muita seurantaresursseja eikä sille lähetetä mittaustietoja, ennen kuin hyväksyt analytiikan. Sivusto ja tarjouspyyntölomake toimivat myös ilman hyväksyntää.</p>
      <p><strong>Suostumusvalinta.</strong> Tallennamme vain valinnan, sen version ja vanhenemisajan selaimen localStorage-muistiin avaimella <code>tehopiha.analytics-consent.v1</code> enintään 180 päiväksi. Tietoa käytetään valintasi muistamiseen, ei kävijän seurantaan. Tallenne ei sisällä nimeä tai yhteystietoja. Jos selaintallennus on estetty, valinta toimii vain avoimella sivulla ja se kysytään uudelleen seuraavalla latauksella.</p>
      <p><strong>Analytiikkaevästeet.</strong> Hyväksynnän jälkeen Google Analytics voi asettaa ensimmäisen osapuolen <code>_ga</code>- ja <code>_ga_CWKEST2H7X</code>-evästeitä selaimen ja istunnon erottamiseen. Tässä toteutuksessa niiden kesto rajataan enintään 180 päivään ilman automaattista pidennystä; selain voi rajoittaa kestoa lyhyemmäksi. Mittaamme sivukatselua, yleisiä käyttötapahtumia kuten vieritystä sekä onnistuneiden tarjouspyyntöjen määrää ilman lomakkeen sisältöä. Mainonnan seurantaa tai Meta Pixeliä ei lisätä. Lisätiedot käsittelystä ja Googlen palvelusta ovat tietosuojaselosteessa.</p>
      <p><strong>Valinnan muuttaminen.</strong> Avaa alatunnisteen Evästeasetukset ja valitse Hyväksy analytiikka tai Hylkää analytiikka. Hylkääminen ja suostumuksen peruminen pysäyttävät mittauksen ja poistavat tämän sivuston analytiikkaevästeet selaimestasi. Jo Googlelle toimitettuja tietoja ei poisteta tällä valinnalla. Suostumus on selain- ja laitekohtainen; vanhentuneen valinnan jälkeen analytiikka pysyy pois päältä, kunnes hyväksyt sen uudelleen.</p>
      <p>Kuvat, fontit ja kuvakkeet ladataan sivuston omista tiedostoista. Google-arvostelu on tekstiä, ei Google-upotus. Sivustolla ei ole upotettuja karttoja, videoita tai CAPTCHA-palvelua. Selain voi välimuistittaa tavallisia sivustotiedostoja. Ulkoisen linkin avaamisen jälkeen sovelletaan kyseisen palvelun omia käytäntöjä.</p>
      <p>Lomaketta lähetettäessä selain välittää tiedot Web3Formsin API:in. GitHub Pages käsittelee sivupyyntöjä ja kirjaa IP-osoitteita turvallisuutta varten. Tämä palvelinpuolen käsittely on eri asia kuin selainevästeet, eikä analytiikan hylkääminen estä sitä. Web3Formsin ja hostingin tarkemmat tiedot ovat tietosuojaselosteessa.</p>
    </>}</div>}
  </dialog>;
}
function App() {
  const [chosen, setChosen] = useState(''); const [modal, setModal] = useState<Modal>(null);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return <><a className="skip-link" href="#main">Siirry sisältöön</a><Header /><main id="main"><Hero /><Services choose={setChosen} /><WhyChooseUs /><Projects view={index => setModal({ type: 'gallery', index })} /><Process /><Contact chosen={chosen} /></main><Footer legal={type => setModal({ type })} cookieSettings={() => setCookieSettingsOpen(true)} /><CookieConsent settingsOpen={cookieSettingsOpen} closeSettings={() => setCookieSettingsOpen(false)} openPolicy={() => { setCookieSettingsOpen(false); setModal({ type: 'cookies' }); }} /><SiteDialog modal={modal} close={() => setModal(null)} navigate={index => setModal({ type: 'gallery', index })} /></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
