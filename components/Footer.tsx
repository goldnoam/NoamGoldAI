import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { Translation } from '../types';

interface FooterProps {
  t: Translation;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full glass-dark border-t border-white/10 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.title}
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm font-bold">
                &copy; Noam Gold AI 2026
              </p>
              <p className="text-muted-foreground text-xs opacity-60">
                All Rights Reserved
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a href="https://noamgoldai.vercel.app/" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              {t.moreSites}
            </a>
            <a href="https://noam-gold-games.vercel.app/" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              {t.moreGames}
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-6">
              <motion.a 
                whileHover={{ scale: 1.1, color: "#0077b5" }}
                href="https://www.linkedin.com/in/noamgold" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                href="https://github.com/goldnoam" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={28} />
              </motion.a>
            </div>

            <a
              href="mailto:goldnoamai@gmail.com"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <Mail className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-bold text-sm uppercase tracking-widest">Send Feedback</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;