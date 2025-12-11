import React, { useState } from 'react';
import { Share2, Check, Loader2 } from 'lucide-react';
import { Translation } from '../types';

interface ShareButtonProps {
  t: Translation;
}

const ShareButton: React.FC<ShareButtonProps> = ({ t }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: t.title,
          text: t.subtitle,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    } finally {
      // Small delay to prevent flickering on fast operations
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <div 
        className={`absolute bottom-full right-0 mb-3 whitespace-nowrap bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 transition-all duration-200 transform origin-bottom pointer-events-none select-none
        ${copied 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
        }`}
      >
        {copied ? t.copied : t.share}
      </div>

      <button
        onClick={handleShare}
        disabled={loading}
        className={`bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 flex items-center justify-center ${loading ? 'cursor-wait scale-100' : 'hover:scale-110 active:scale-95'}`}
        aria-label={t.share}
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : copied ? (
          <Check className="w-6 h-6" />
        ) : (
          <Share2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default ShareButton;