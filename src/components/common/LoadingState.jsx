import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading fleet records...', className = '' }) {
  return (
    <div className={`p-12 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3 ${className}`}>
      <div className="p-3 bg-blue-50 text-[#075EE8] rounded-2xl animate-spin">
        <Loader2 className="w-6 h-6" />
      </div>
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
}

