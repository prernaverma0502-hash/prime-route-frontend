import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { fleetStatusData } from '../../data/mockData';

export default function FleetStatusChart({ data }) {
  const currentData = (data && data.length > 0) ? data : fleetStatusData;
  const total = currentData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8] shrink-0">
          <PieIcon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-[#0A1E42] text-xs sm:text-sm xl:text-base whitespace-nowrap">
          Fleet Status
        </h3>
      </div>

      <div className="flex items-center justify-between gap-2 xl:gap-3 py-1">
        {/* Donut Chart with Center label */}
        <div className="relative w-[130px] h-[130px] sm:w-[140px] sm:h-[140px] xl:w-[155px] xl:h-[155px] shrink-0 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} Vehicles`, name]}
                contentStyle={{
                  backgroundColor: '#071D49',
                  borderRadius: '10px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg xl:text-2xl font-black text-[#0A1E42] leading-none">
              {total}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1 xl:gap-1.5 min-w-[95px] sm:min-w-[105px] xl:min-w-[120px]">
          {currentData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-1 text-[10px] xl:text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-[#0A1E42]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

