import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { FormEvent, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, MapPin, CircleCheck, MessageCircle, FileText, Hammer, House, Mail, Phone, Menu, X, ChevronLeft, ChevronRight, UsersRound } from 'lucide-react';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/roboto/latin-900.css';
import { company, navigation, services, projects } from './config';
import { validateContact, submitContact } from './contact';
import type { ContactFields, ContactErrors } from './contact';
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
        .from(select('.hero-audience'), { opacity: 0, y: 6, duration: 0.55, clearProps: 'opacity,transform' }, 0.5);
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
    <img className="hero-image" src="/images/hero.webp" alt="Kuvituskuva: vaalea suomalainen puutalo, puuterassi ja vehreä kesäpiha" fetchPriority="high" width="1536" height="1024" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-inner">
      <p className="hero-kicker">PAIKALLISTA OSAAMISTA</p>
      <h1 id="hero-heading">Remontit ja<br />saneeraukset<br /><span>Nurmijärvellä</span></h1>
      <p className="hero-description">Teemme pintaremontteja, maalaustöitä ja muita saneeraustöitä huolellisesti Nurmijärvellä ja lähialueilla.</p>
      <div className="hero-actions"><a href="#yhteystiedot" className="button">Pyydä tarjous <ArrowRight size={19} /></a><a href="#palvelut" className="button button-outline">Katso palvelut</a></div>
      <div className="hero-audience"><span className="hero-audience-icon" aria-hidden="true"><UsersRound size={28} strokeWidth={1.8} /></span><div><h3>Yksityisille ja yrityksille</h3><p>Samat korkeat laatuvaatimukset kaikille asiakkaillemme.</p></div></div>
    </div>
  </section>;
}
function Services({ choose }: { choose: (service: string) => void }) {
  return <section id="palvelut" className="services section" aria-labelledby="services-heading"><div className="container">
    <div className="section-heading reveal"><div><Eyebrow>Palvelumme</Eyebrow><h2 id="services-heading">Remontointia kodin eri tarpeisiin</h2></div><p>Tarjoamme laadukkaita remontti- ja maalauspalveluita Nurmijärvellä ja lähialueilla. Oli kyseessä pieni päivitys tai laajempi saneeraus, autamme mielellämme.</p></div>
    <div className="services-grid">{services.map((service, index) => <a key={service.title} className="service-card reveal" style={{ '--delay': `${index * 55}ms` } as React.CSSProperties} href="#yhteystiedot" onClick={() => choose(service.title)} aria-label={`${service.title} – pyydä tarjous`}>
      <div className="service-image"><img src={`/images/${service.image}.webp`} alt={service.alt} loading="lazy" width="560" height="420" /></div>
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
    <span className="comparison-half"><img src={project.beforeImage} alt="Ennen: keskeneräinen, epätasainen seinän sauma" loading="lazy" /><span className="comparison-label">ENNEN</span></span>
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
  const [status, setStatus] = useState<'idle' | 'busy' | 'not-connected'>('idle');
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (chosen) { setValues(v => ({ ...v, message: v.message || `Olen kiinnostunut palvelusta: ${chosen}. ` })); setStatus('idle'); } }, [chosen]);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); const next = validateContact(values); setErrors(next);
    const key = Object.keys(next)[0];
    if (key) { form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(); return; }
    setStatus('busy'); const result = await submitContact(values); setStatus(result.status);
  };
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent('Tarjouspyyntö – TehoPiha')}&body=${encodeURIComponent(`${values.message}\n\nRemonttikohteen sijainti: ${values.location}\n\n${values.name}\n${values.email}\n${values.phone}`)}`;
  const field = (name: keyof ContactFields, label: string, type = 'text', required = false) => {
    const shared = { id: `contact-${name}`, name, required, value: values[name], 'aria-invalid': errors[name] ? true as const : undefined, 'aria-describedby': errors[name] ? `error-${name}` : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const next = { ...values, [name]: e.target.value }; setValues(next); setStatus('idle'); if (errors[name]) setErrors(prev => ({ ...prev, [name]: validateContact(next)[name] })); },
      // Let submit validate when focus moves to its button: inserting an error during
      // pointer-down would move the button before pointer-up and cancel the click.
      onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.relatedTarget instanceof HTMLButtonElement && event.relatedTarget.type === 'submit') return;
        setErrors(prev => ({ ...prev, [name]: validateContact(values)[name] }));
      }, maxLength: name === 'message' ? 4000 : 180 };
    return <div className="field"><label htmlFor={shared.id}>{label}{required && <span className="required"> *</span>}</label>{name === 'message' ? <textarea {...shared} rows={3} placeholder="Esim. kodinhoitohuoneen remontti, maalaus, aikataulu…" /> : <input {...shared} type={type} placeholder={name === 'location' ? 'Esim. Klaukkala, Nurmijärvi tai 01800' : undefined} autoComplete={{ name: 'name', email: 'email', phone: 'tel', location: 'off', message: 'off' }[name]} />}{errors[name] && <p id={`error-${name}`} className="field-error">{errors[name]}</p>}</div>;
  };
  return <section id="yhteystiedot" className="contact" aria-labelledby="contact-heading"><div className="contact-photo"><img src="/images/contact.webp" alt="Valkoisia kukkia ruukussa suomalaisen puutalon terassiportailla" width="1086" height="1448" loading="lazy" /></div><div className="container contact-grid">
    <div className="contact-copy reveal"><Eyebrow>Ota yhteyttä</Eyebrow><h2 id="contact-heading">Pyydä tarjous</h2><p>Ota yhteyttä ja kerro projektistasi. Vastaamme mielellämme kysymyksiin ja sovimme tarvittaessa maksuttoman kartoituskäynnin Nurmijärvellä tai lähialueilla.</p>
      <dl className="contact-details"><div><dt><span className="icon-circle"><House size={23} /></span>Yritys</dt><dd>{company.officialName}</dd></div><div><dt><span className="icon-circle"><MapPin size={23} /></span>Sijainti</dt><dd>{company.locality}</dd></div>{company.phone && <div><dt><span className="icon-circle"><Phone size={23} /></span>Puhelin</dt><dd><a href={`tel:${company.phoneHref}`}>{company.phone}</a></dd></div>}<div><dt><span className="icon-circle"><Mail size={23} /></span>Sähköposti</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div></dl>
    </div>
    <form ref={form} className="contact-form reveal" onSubmit={onSubmit} noValidate aria-label="Tarjouspyyntö">
      {field('name', 'Nimi', 'text', true)}{field('email', 'Sähköposti', 'email', true)}{field('phone', 'Puhelin', 'tel')}{field('location', 'Remonttikohteen sijainti', 'text', true)}{field('message', 'Kerro lyhyesti projektistasi', 'text', true)}
      <button className="button submit-button" type="submit" disabled={status === 'busy'}>{status === 'busy' ? 'Tarkistetaan…' : 'Lähetä viesti'}<ArrowRight size={19} /></button>
      <p className="form-note">Demo: lomake ei vielä lähetä viestejä. Voit ottaa yhteyttä sähköpostitse.</p>
      <div className="form-status" role="status" aria-live="polite">{status === 'not-connected' && <><p>Viestiä ei lähetetty. Lomakkeen lähetystä ei ole vielä kytketty. Voit avata viestisi omassa sähköpostiohjelmassasi.</p><a className="text-link" href={mailto}>Avaa sähköpostissa <ArrowRight size={17} /></a></>}</div>
    </form>
  </div></section>;
}
function Footer({ legal }: { legal: (type: 'privacy' | 'cookies') => void }) { return <footer className="footer"><div className="container footer-grid">
  <div><Logo footer /><p className="official-company">{company.officialName}</p><p className="business-id">Y-tunnus: {company.businessId}</p><p>Remontit ja saneeraukset Nurmijärvellä</p></div><div className="footer-links"><h3>Pikalinkit</h3><nav aria-label="Alatunnisteen valikko">{navigation.map(item => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}</nav></div><div className="footer-contact"><h3>Yhteystiedot</h3><p><MapPin size={16} />{company.locality}</p><a href={`mailto:${company.email}`}><Mail size={16} />{company.email}</a>{company.phone && <a href={`tel:${company.phoneHref}`}><Phone size={16} />{company.phone}</a>}<h3 style={{ marginTop: 16 }}>Yhteyshenkilöt</h3><p>Eemeli Mouhu</p><p>Noora Asikainen</p></div>
  </div><div className="footer-bottom"><div className="container"><p>© {new Date().getFullYear()} {company.officialName}. Kaikki oikeudet pidätetään.</p><div><button onClick={() => legal('privacy')}>Tietosuojaseloste</button><button onClick={() => legal('cookies')}>Evästekäytäntö</button></div></div></div>
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
    {project && modal?.type === 'gallery' ? <><ProjectMedia project={project} /><div className="dialog-copy"><Eyebrow>Työkuva · {modal.index + 1} / {projects.length}</Eyebrow><h2 id="dialog-title">{project.title}</h2>{project.beforeImage && <p className="legal-note">Kuvat on otettu eri etäisyyksiltä ja eri kulmista.</p>}<div className="gallery-controls"><button className="button button-light" onClick={() => navigate((modal.index + projects.length - 1) % projects.length)} aria-label="Edellinen kuva"><ChevronLeft /> Edellinen</button><button className="button button-light" onClick={() => navigate((modal.index + 1) % projects.length)} aria-label="Seuraava kuva">Seuraava <ChevronRight /></button></div></div></> : <div className="dialog-copy"><Eyebrow>Paikallinen esittelyversio</Eyebrow><h2 id="dialog-title">{modal?.type === 'privacy' ? 'Tietosuoja' : 'Evästekäytäntö'}</h2>{modal?.type === 'privacy' ? <><p>Tämä sivusto on paikallinen demo. Lomakkeen tietoja ei lähetetä palvelimelle eikä tallenneta selaimen pysyvään tallennustilaan. Tiedot säilyvät sivun muistissa, kunnes sivu ladataan uudelleen.</p><p>Jos avaat viestin sähköpostiohjelmassasi, viestin lähettäminen tapahtuu omasta sähköpostipalvelustasi. Yhteydenotto: <a href={`mailto:${company.email}`}>{company.email}</a>.</p><p className="legal-note">Ennen julkaisua tähän lisätään vahvistettu rekisterinpitäjä, käsittelyn tarkoitukset ja oikeusperuste, säilytysajat, vastaanottajat sekä rekisteröidyn oikeudet.</p></> : <><p>Tämä demo ei käytä analytiikkaa, markkinointievästeitä tai muita evästeitä. Kuvat ja kirjasimet ladataan paikallisesti.</p><p className="legal-note">Käytäntö tarkistetaan ennen julkaisua ja mahdollisten analytiikka- tai CRM-palveluiden käyttöönottoa.</p></>}</div>}
  </dialog>;
}
function App() {
  const [chosen, setChosen] = useState(''); const [modal, setModal] = useState<Modal>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return <><a className="skip-link" href="#main">Siirry sisältöön</a><Header /><main id="main"><Hero /><Services choose={setChosen} /><WhyChooseUs /><Projects view={index => setModal({ type: 'gallery', index })} /><Process /><Contact chosen={chosen} /></main><Footer legal={type => setModal({ type })} /><SiteDialog modal={modal} close={() => setModal(null)} navigate={index => setModal({ type: 'gallery', index })} /></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
