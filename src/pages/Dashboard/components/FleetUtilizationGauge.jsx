import React from 'react';
import { Gauge, TrendingUp, Target, Activity } from 'lucide-react';

export default function FleetUtilizationGauge({
  utilizationRate = 71,
  activeCount = 46,
  totalCount = 65,
  targetRate = 85,
}) {
  // Clamp rate between 0 and 100
  const rate = Math.min(100, Math.max(0, Math.round(utilizationRate)));
  
  // Circumference for a 60px radius circle arc (approx 260 degrees arc)
  const radius = 54;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc angle of 260 degrees (leaving 100 degrees gap at the bottom)
  const arcLength = circumference * (260 / 360);
  const strokeDashoffset = arcLength - (rate / 100) * arcLength;

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8] shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0A1E42] text-xs sm:text-sm xl:text-base whitespace-nowrap">
            Fleet Utilization
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          +4.2% MoM
        </span>
      </div>

      {/* Radial Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-auto py-2">
        <div className="relative w-[140px] h-[130px] sm:w-[150px] sm:h-[135px] xl:w-[160px] xl:h-[140px] flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-[130deg]" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={normalizedRadius}
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Value Track */}
            <circle
              cx="60"
              cy="60"
              r={normalizedRadius}
              fill="transparent"
              stroke="#075EE8"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Percentage Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2 pointer-events-none">
            <div className="flex items-baseline justify-center">
              <span className="text-2xl xl:text-3xl font-black text-[#0A1E42] tracking-tight">
                {rate}
              </span>
              <span className="text-sm font-extrabold text-[#075EE8] ml-0.5">%</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Active Ratio
            </span>
          </div>
        </div>
      </div>

      {/* Footer Metrics Breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="bg-slate-50/80 rounded-xl p-2 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">In Service</span>
          <span className="font-extrabold text-[#0A1E42] text-xs">
            {activeCount} / {totalCount} Cars
          </span>
        </div>
        <div className="bg-slate-50/80 rounded-xl p-2 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">Benchmark</span>
          <span className="font-extrabold text-blue-700 text-xs">
            Target {targetRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

