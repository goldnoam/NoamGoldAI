import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Translation } from '../types';

interface ShareButtonProps {
  t: Translation;
}

const ShareButton: React.FC<ShareButtonProps> = ({ t }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: t.subtitle,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:animate-bounce transition-all duration-300 flex items-center justify-center group"
      aria-label={t.share}
    >
      {copied ? <Check size={24} /> : <Share2 size={24} />}
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
        {copied ? t.copied : t.share}
      </span>
    </button>
  );
};

export default ShareButton;