import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import SafeImage from '../../../components/common/SafeImage';

export default function TopVehiclesCard({
  displayedTopVehicles,
  onNavigate,
  onViewVehicle,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Trophy className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0A1E42] text-sm">Top Performing Vehicles</h3>
        </div>
        <button
          onClick={() => onNavigate('reports')}
          className="text-xs font-semibold text-[#075EE8] hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          View Report <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 px-2">Vehicle</th>
              <th className="py-2 px-2 text-right">Revenue</th>
              <th className="py-2 pl-2 text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 text-xs">
            {displayedTopVehicles.map((car) => (
              <tr
                key={car.id}
                onClick={() => {
                  if (onViewVehicle) onViewVehicle(car);
                  else onNavigate('vehicles');
                }}
                className="hover:bg-blue-50/40 cursor-pointer group transition-all duration-200"
              >
                <td className="py-2.5 pr-2 font-medium text-slate-400 group-hover:text-slate-600">{car.rank}</td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2.5">
                    <SafeImage
                      src={car.image}
                      alt={car.name}
                      type="vehicle"
                      className="w-10 h-7 object-cover rounded-md border border-slate-100 shrink-0 transition-transform duration-200 group-hover:scale-108"
                    />
                    <span className="font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate max-w-[120px]">
                      {car.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-right font-bold text-[#0A1E42]">
                  {formatCurrency(car.revenue)}
                </td>
                <td className="py-2.5 pl-2 text-right font-bold text-emerald-600">
                  {formatCurrency(car.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

