import React from 'react';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#071D49] text-white py-3 px-6 mt-auto border-t border-[#0D2D6C]/50 text-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300">
        <div>
          <span>© 2025 PrimeRoute. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1.5 text-white/90 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
            Secure &amp; Reliable
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-[#38BDF8] font-semibold">Powered by PrimeRoute</span>
        </div>
      </div>
    </footer>
  );
}

