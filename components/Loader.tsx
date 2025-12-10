import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Background Ring */}
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          {/* Inner Pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-widest animate-pulse uppercase">Loading</p>
      </div>
    </div>
  );
};

export default Loader;