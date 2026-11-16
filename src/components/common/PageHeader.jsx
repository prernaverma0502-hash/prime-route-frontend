import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  category = 'Fleet Operations',
  actions = null,
  breadcrumb = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>PrimeRoute</span>
          <span>/</span>
          <span className="text-[#075EE8] font-semibold">{breadcrumb || category}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0A1E42] tracking-tight mt-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

