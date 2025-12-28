import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { getIcon } from '../constants';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  title: string;
  description: string;
  visitText: string;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({ data, title, description, visitText, loading }) => {
  if (loading) {
    return (
      <div className="h-full bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[300px] animate-pulse shadow-sm">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 hover:bg-white dark:hover:bg-slate-800/60 hover:border-blue-500/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all duration-500 ease-out transform hover:-translate-y-1.5 hover:scale-[1.02] overflow-hidden cursor-pointer grid grid-rows-[auto_auto_1fr_auto] gap-6"
    >
      {/* External link indicator */}
      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-2 group-hover:translate-x-0">
        <ExternalLink className="text-blue-500 dark:text-blue-400 w-5 h-5" />
      </div>

      {/* Icon Container */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-hover:border-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-blue-500/20">
        {getIcon(data.icon, "w-8 h-8")}
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base line-clamp-3">
          {description}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="w-full mt-auto">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800/50 truncate w-full mb-5 group-hover:border-blue-500/20 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse"></span>
          <span className="truncate opacity-70 group-hover:opacity-100 transition-opacity">{data.url.replace('https://', '')}</span>
        </div>
        
        <span className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          {visitText}
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 group-hover:scale-125 transition-all duration-700 pointer-events-none z-0"></div>
    </a>
  );
};

export default Card;