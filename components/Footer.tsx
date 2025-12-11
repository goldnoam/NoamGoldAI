import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { Translation } from '../types';

interface FooterProps {
  t: Translation;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.title}
            </h2>
            <span className="text-slate-500 text-sm">
              &copy; {t.footerRights}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/noamgold/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#0077b5] transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://github.com/goldnoam" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            </div>

            <div className="hidden md:block w-px h-6 bg-slate-800"></div>

            <a
              href="mailto:gold.noam@gmail.com"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-300 group px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{t.sendFeedback}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;