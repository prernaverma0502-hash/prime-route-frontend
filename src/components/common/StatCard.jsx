import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  change,
  subtitle,
  badge,
  badgeColor = 'bg-blue-50 text-[#075EE8] border-blue-200/60',
  isPositive = true,
  icon: Icon,
  customIcon,
  iconColor = 'text-[#075EE8]',
  iconBg,
  progress,
  progressColor = 'bg-[#075EE8]',
  prefix = '',
  suffix = '',
  className = '',
  onClick
}) {
  const isRed = !isPositive || (change && change.includes('8%') && title?.toLowerCase().includes('expense'));

  // When customIcon is passed (Image 2 KPI Mode), render exact horizontal card matching reference Image 2
  if (customIcon) {
    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-2xl p-2.5 sm:p-3 xl:p-4 2xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300 ease-out flex items-center gap-2 sm:gap-2.5 xl:gap-3.5 group cursor-pointer animate-fade-in ${className}`}
      >
        <div className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          {customIcon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] sm:text-[11px] xl:text-xs font-semibold text-slate-500 leading-tight group-hover:text-slate-700 transition-colors whitespace-nowrap">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <h3 className="text-sm sm:text-base xl:text-xl 2xl:text-2xl font-black text-[#0A1E42] tracking-tight leading-tight whitespace-nowrap">
              {prefix}{value}{suffix}
            </h3>
          </div>
          {change && (
            <div
              className={`flex items-center gap-0.5 font-bold text-[9.5px] sm:text-[10px] xl:text-[11px] mt-0.5 leading-tight ${
                isRed ? 'text-rose-500' : 'text-emerald-600'
              }`}
            >
              <span>↑</span>
              <span>{change.replace(/[↑↓]/g, '').trim()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-2.5 sm:p-3 xl:p-3.5 border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] hover:shadow-card-hover hover:-translate-y-0.5 hover:border-blue-200/60 transition-all duration-200 ease-out flex flex-col justify-between group cursor-pointer animate-fade-in ${className}`}
    >
      <div>
        {/* Top Row: Icon & Badge */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {Icon && (
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                iconBg || 'bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2] ${iconColor}`} />
            </div>
          )}

          {badge && (
            <span
              className={`text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Middle: Full-Width Title & Compact Bold Value */}
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-tight group-hover:text-slate-800 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <h3 className="text-lg sm:text-xl xl:text-2xl font-black text-[#0A1E42] tracking-tight leading-tight">
              {prefix}{value}{suffix}
            </h3>
          </div>
        </div>
      </div>

      {/* Bottom Row: Subtitle, Change Metric & Progress Bar */}
      {(change || subtitle || progress !== undefined) && (
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs gap-1">
            {subtitle && (
              <span className="text-slate-400 font-medium text-[10px] sm:text-[10.5px] leading-tight">
                {subtitle}
              </span>
            )}

            {change && (
              <div
                className={`flex items-center gap-0.5 font-bold shrink-0 text-[10px] sm:text-[11px] ${
                  isRed ? 'text-rose-500' : 'text-emerald-600'
                }`}
              >
                <span>↑</span>
                <span>{change.replace(/[↑↓]/g, '').trim()}</span>
              </div>
            )}
          </div>

          {/* Micro Progress Bar */}
          {progress !== undefined && (
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
