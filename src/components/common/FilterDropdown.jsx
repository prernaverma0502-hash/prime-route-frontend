import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({
  label = 'Filter',
  value,
  options = [],
  onChange,
  className = '',
  icon = true
}) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {icon && <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white text-xs sm:text-sm font-medium text-[#0A1E42] border border-slate-200 rounded-lg py-2 ${
          icon ? 'pl-8' : 'pl-3'
        } pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] cursor-pointer shadow-sm hover:border-slate-300 transition-all`}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
          const lbl = typeof opt === 'object' && opt !== null ? opt.label : opt;
          return (
            <option key={val !== undefined ? val : idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
}

