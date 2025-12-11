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
        className={`group flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full border border-slate-700 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/30 ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
        aria-label="Select language"
      >
        <Globe size={18} className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        <span className="text-base font-medium group-hover:text-blue-50 transition-colors duration-300">{label}</span>
        <span className="text-lg leading-none">{currentFlag}</span>
        <ChevronDown size={16} className={`text-slate-400 group-hover:text-blue-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden py-1 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors ${
                currentLang === lang.code ? 'bg-slate-700/50 text-blue-400' : 'text-slate-200'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;