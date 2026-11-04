import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white text-sm text-[#0A1E42] placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

