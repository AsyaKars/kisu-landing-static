import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SITE_CONFIG } from '@/config/site';
import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Assortment from './sections/Assortment';
import Technology from './sections/Technology';
import Quality from './sections/Quality';
import Cooperation from './sections/Cooperation';
import Contacts from './sections/Contacts';
import Lookbook from './sections/Lookbook';
import Retail from './sections/Retail';
import Footer from './sections/Footer';

// ─── SiteMetaTags ─────────────────────────────────────────────────────────────
// Reads values from src/config/site.ts and injects them into <head>.
// Replaces the DB-backed admin-panel version of the original project.

function SiteMetaTags() {
  useEffect(() => {
    if (SITE_CONFIG.siteTitle) {
      document.title = SITE_CONFIG.siteTitle;
    }

    if (SITE_CONFIG.yandexVerifyCode) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="yandex-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'yandex-verification';
        document.head.appendChild(meta);
      }
      meta.content = SITE_CONFIG.yandexVerifyCode;
    }

    const id = SITE_CONFIG.yandexMetrikaId;
    if (id && !document.querySelector('script[data-ym="1"]')) {
      const script = document.createElement('script');
      script.setAttribute('data-ym', '1');
      script.type = 'text/javascript';
      script.textContent = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
      `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + id + '" style="position:absolute; left:-9999px;" alt="" /></div>';
      document.body.appendChild(noscript);
    }
  }, []);

  return null;
}

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PersonalData = lazy(() => import('./pages/PersonalData'));
const Sizes = lazy(() => import('./pages/Sizes'));
const Care = lazy(() => import('./pages/Care'));
const Certificates = lazy(() => import('./pages/Certificates'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-kisu-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePartnerClick = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteMetaTags />
      <Header onPartnerClick={handlePartnerClick} />
      <main>
        <Hero onPartnerClick={handlePartnerClick} />
        <About />
        <Assortment />
        <Retail />
        <Technology />
        <Quality />
        <Cooperation isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />

        <div className="w-full bg-kisu-orange py-16 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/90 text-lg mb-6 font-medium">
            Присоединяйтесь к сети партнёров KISU по всей России
          </p>
          <button
            onClick={handlePartnerClick}
            className="bg-white text-kisu-orange font-heading font-bold text-lg px-12 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Стать партнёром
          </button>
        </div>

        <Lookbook />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<Loading />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route
          path="/personal-data"
          element={
            <Suspense fallback={<Loading />}>
              <PersonalData />
            </Suspense>
          }
        />
        <Route
          path="/sizes"
          element={
            <Suspense fallback={<Loading />}>
              <Sizes />
            </Suspense>
          }
        />
        <Route
          path="/care"
          element={
            <Suspense fallback={<Loading />}>
              <Care />
            </Suspense>
          }
        />
        <Route
          path="/certificates"
          element={
            <Suspense fallback={<Loading />}>
              <Certificates />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
