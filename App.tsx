import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, CARDS } from './constants';
import { LanguageCode } from './types';
import LanguageSelector from './components/LanguageSelector';
import Card from './components/Card';
import Footer from './components/Footer';
import ShareButton from './components/ShareButton';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(LanguageCode.EN);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const t = TRANSLATIONS[currentLang];

  // Simulate initial loading for cards
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle RTL direction for Hebrew
  useEffect(() => {
    const isRTL = currentLang === LanguageCode.HE;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Handle theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-500">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              NG
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <LanguageSelector 
              currentLang={currentLang} 
              onLanguageChange={setCurrentLang}
              label={t.language}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
             {t.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CARDS.map((card) => (
            <Card
              key={card.id}
              data={card}
              title={t[card.titleKey]}
              description={t[card.descKey]}
              visitText={t.visit}
              loading={loading}
            />
          ))}
        </div>
      </main>

      <Footer t={t} />
      <ShareButton t={t} />
    </div>
  );
}

export default App;