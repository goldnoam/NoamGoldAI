import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFlag = LANGUAGES.find(l => l.code === currentLang)?.flag;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 glass border border-white/10 hover:border-primary px-4 py-2.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/30 ${isOpen ? 'border-primary ring-2 ring-primary/20' : ''}`}
        aria-label="Select language"
      >
        <Globe size={18} className="text-primary group-hover:text-primary transition-colors duration-300" />
        <span className="text-sm font-bold uppercase tracking-widest group-hover:text-foreground transition-colors duration-300">{label}</span>
        <span className="text-lg leading-none">{currentFlag}</span>
        <ChevronDown size={16} className={`text-muted-foreground group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-white/5 transition-colors ${
                currentLang === lang.code ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-bold tracking-wide">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;