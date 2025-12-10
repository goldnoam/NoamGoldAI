import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getIcon } from '../constants';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  title: string;
  description: string;
  visitText: string;
}

const Card: React.FC<CardProps> = ({ data, title, description, visitText }) => {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 hover:bg-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="text-blue-400 w-5 h-5" />
      </div>

      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-300 shadow-lg">
        {getIcon(data.icon, "w-8 h-8")}
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>

      <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      <div className="mt-auto">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900/50 rounded-lg p-2 border border-slate-700/50 truncate w-full mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse"></span>
          <span className="truncate">{data.url}</span>
        </div>
        
        <span className="inline-flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300">
          {visitText}
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>
    </a>
  );
};

export default Card;