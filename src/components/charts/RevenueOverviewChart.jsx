import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { revenueOverviewData } from '../../data/mockData';

export default function RevenueOverviewChart() {
  const [timeframe, setTimeframe] = useState('This Month');
  const data = revenueOverviewData[timeframe] || revenueOverviewData['This Month'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#071D49] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <p className="font-semibold text-slate-300">{label}</p>
          <p className="text-[#38BDF8] flex items-center justify-between gap-4">
            <span>Revenue:</span>
            <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
          </p>
          <p className="text-slate-300 flex items-center justify-between gap-4">
            <span>Expenses:</span>
            <span className="font-bold">${payload[1]?.value?.toLocaleString()}</span>
          </p>
          <p className="text-emerald-400 font-bold pt-1 border-t border-slate-700 flex items-center justify-between gap-4">
            <span>Net:</span>
            <span>${((payload[0]?.value || 0) - (payload[1]?.value || 0)).toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8] shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0A1E42] text-xs sm:text-sm xl:text-base whitespace-nowrap truncate">
            Revenue Overview
          </h3>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[10px] xl:text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#075EE8]" /> Rev
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#0A1E42]" /> Exp
            </span>
          </div>

          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-50 text-[10px] sm:text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-2 py-1 pr-5 appearance-none focus:outline-none focus:ring-1 focus:ring-[#075EE8] cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last 6 Months">Last 6 Mos</option>
              <option value="This Year">This Year</option>
            </select>
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(v) => (v === 0 ? '0k' : `${v / 1000}k`)}
              domain={[0, 50000]}
              ticks={[0, 10000, 20000, 30000, 40000, 50000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#075EE8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#075EE8', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#075EE8', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#0A1E42"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0A1E42', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0A1E42', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

