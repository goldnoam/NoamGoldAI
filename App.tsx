import React, { useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS, CARDS } from './constants';
import { LanguageCode } from './types';
import LanguageSelector from './components/LanguageSelector';
import Card from './components/Card';
import Footer from './components/Footer';
import ShareButton from './components/ShareButton';
import { Sun, Moon, Search, X } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(LanguageCode.EN);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const t = TRANSLATIONS[currentLang];

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Trigger entrance animation slightly after loading ends
      setTimeout(() => setIsVisible(true), 100);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger re-animation when search changes or language changes
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [searchQuery, currentLang]);

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

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return CARDS;
    const query = searchQuery.toLowerCase();
    return CARDS.filter((card) => {
      const title = t[card.titleKey].toLowerCase();
      const desc = t[card.descKey].toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
  }, [searchQuery, t]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-500">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              NG
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              {t.title}
            </h1>
          </div>

          <div className="flex-grow max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
              <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2 pl-10 pr-10 rtl:pr-10 rtl:pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm md:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rtl:right-auto rtl:left-0 rtl:pl-3"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden xs:block">
              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={setCurrentLang}
                label={t.language}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
             {t.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {filteredCards.map((card, index) => (
              <div 
                key={card.id} 
                className="transition-all duration-700 ease-out"
                style={{ 
                  opacity: isVisible ? 1 : 0, 
                  transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <Card
                  data={card}
                  title={t[card.titleKey]}
                  description={t[card.descKey]}
                  visitText={t.visit}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xl text-slate-500 dark:text-slate-400">No results found for "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-500 hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      <Footer t={t} />
      <ShareButton t={t} />
    </div>
  );
}

export default App;