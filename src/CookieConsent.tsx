import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getAnalyticsConsent, initializeAnalyticsConsent, setAnalyticsConsent, subscribeAnalyticsConsent } from './analytics';

export function CookieConsent({ settingsOpen, closeSettings, openPolicy }: {
  settingsOpen: boolean; closeSettings: () => void; openPolicy: () => void;
}) {
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent);
  const ref = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { initializeAnalyticsConsent(); }, []);
  useEffect(() => {
    if (settingsOpen && !ref.current?.open) ref.current?.showModal();
    else if (!settingsOpen && ref.current?.open) ref.current.close();
  }, [settingsOpen]);
  const choose = (choice: 'granted' | 'denied') => {
    setAnalyticsConsent(choice);
    setNotice(choice === 'granted' ? 'Analytiikka on hyväksytty.' : 'Analytiikka on pois käytöstä.');
    closeSettings();
  };
  const actions = <div className="consent-actions">
    <button className="button button-light" onClick={() => choose('granted')}>Hyväksy evästeet</button>
    <button className="button button-light" onClick={() => choose('denied')}>Hylkää evästeet</button>
  </div>;
  return <>
    {consent === null && !settingsOpen && <section className="consent-banner" aria-labelledby="consent-heading" aria-describedby="consent-description">
      <div><h2 id="consent-heading">Evästeet</h2><p id="consent-description">Käytämme luvallasi Google Analyticsia kävijämäärien ja sivuston käytön ymmärtämiseen. Ilman hyväksyntää analytiikkaa ei ladata. Voit käyttää sivustoa ja lähettää tarjouspyynnön myös ilman analytiikkaa.</p><button className="consent-policy" onClick={openPolicy}>Lue evästekäytäntö</button></div>
      {actions}
    </section>}
    <dialog ref={ref} className="site-dialog consent-dialog" aria-labelledby="consent-settings-heading" onCancel={closeSettings}>
      <div className="dialog-copy"><h2 id="consent-settings-heading">Evästeasetukset</h2>
        <p>Valinnainen Google Analytics auttaa ymmärtämään kävijämääriä, sivukatseluita ja onnistuneiden tarjouspyyntöjen määrää. Lomakkeen sisältöä ei lähetetä Googlelle. Sivusto ja lomake toimivat myös ilman analytiikkaa.</p>
        <p>Nykyinen valinta: <strong>{consent === 'granted' ? 'analytiikka hyväksytty' : consent === 'denied' ? 'analytiikka hylätty' : 'ei valintaa, analytiikka pois käytöstä'}</strong>.</p>
        <p>Voit perua suostumuksesi valitsemalla Hylkää analytiikka. Se pysäyttää mittauksen ja poistaa tämän sivuston analytiikkaevästeet selaimestasi. Jo toimitettuja tietoja ei poisteta tällä valinnalla. Valinta muistetaan enintään 180 päivää.</p>
        {actions}<button className="consent-policy" onClick={openPolicy}>Lue evästekäytäntö</button>
        <button className="button button-light consent-close" onClick={closeSettings}>Sulje asetukset</button>
      </div>
    </dialog>
    <span className="consent-status" role="status" aria-live="polite">{notice}</span>
  </>;
}
