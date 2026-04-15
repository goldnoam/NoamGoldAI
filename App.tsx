import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { TRANSLATIONS, CARDS } from './constants';
import { LanguageCode } from './types';
import LanguageSelector from './components/LanguageSelector';
import Card from './components/Card';
import Footer from './components/Footer';
import ShareButton from './components/ShareButton';
import AnimatedBackground from './components/AnimatedBackground';
import WebGLInteraction from './components/WebGLInteraction';
import GlitterParticles from './components/GlitterParticles';
import CustomCursor from './components/CustomCursor';
import { Sun, Moon, Search, X, Sparkles } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(LanguageCode.EN);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isRTL = currentLang === LanguageCode.HE;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return CARDS;
    const query = searchQuery.toLowerCase();
    return CARDS.filter((card) => {
      const title = t[card.titleKey]?.toLowerCase() || '';
      const desc = t[card.descKey]?.toLowerCase() || '';
      return title.includes(query) || desc.includes(query);
    });
  }, [searchQuery, t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.99 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-primary/30 cursor-none">
      <CustomCursor />
      <AnimatedBackground />
      <WebGLInteraction />
      <GlitterParticles />

      <header className="sticky top-0 z-50 w-full glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 shrink-0"
          >
            <div 
              className="relative group/profile cursor-pointer"
              onDoubleClick={() => window.open('https://www.linkedin.com/in/noamgold', '_blank')}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('profile-hover', { detail: { isHovering: true } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('profile-hover', { detail: { isHovering: false } }))}
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover/profile:border-primary transition-all duration-500 group-hover/profile:scale-110 group-hover/profile:rotate-3 shadow-lg">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4D35AQEZWD92PXWmlg/profile-framedphoto-shrink_200_200/B4DZopElcZGkAY-/0/1761625659441?e=1776855600&v=beta&t=vGkFkyEEyv6iZm8AFJKerz0y_XWRk6y1XCzqnFq6Rc0" 
                  alt="Noam Gold" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-foreground leading-none">
                {t.title}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-70">AI Specialist</span>
            </div>
          </motion.div>

          <div className="flex-grow max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
              <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchKey(prev => prev + 1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-10 rtl:pr-10 rtl:pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchKey(prev => prev + 1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-0 rtl:pl-3"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-full glass border border-white/10 text-foreground hover:text-primary transition-all duration-300 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-bold tracking-widest uppercase text-primary mb-4">
            <Sparkles size={14} />
            Welcome to the Future
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground leading-tight tracking-tighter">
             {t.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            {t.subtitle}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredCards.length > 0 ? (
            <motion.div 
              key={`grid-${searchKey}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[300px]"
            >
              {filteredCards.map((card, index) => {
                // Bento grid logic: first card is large, others are medium
                const gridClass = index === 0 
                  ? "md:col-span-8 md:row-span-2" 
                  : index === 1 
                    ? "md:col-span-4 md:row-span-2"
                    : "md:col-span-4 md:row-span-1";
                
                return (
                  <motion.div 
                    key={card.id} 
                    className={gridClass}
                    variants={cardVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Card
                      data={card}
                      title={t[card.titleKey]}
                      description={t[card.descKey]}
                      visitText={t.visit}
                      loading={loading}
                      isLarge={index === 0}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass rounded-3xl border border-dashed border-white/10"
            >
              <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary hover:underline font-bold"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer t={t} />
      <ShareButton t={t} />
    </div>
  );
}

export default App;
