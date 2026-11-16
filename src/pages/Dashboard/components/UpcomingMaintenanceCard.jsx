import React from 'react';
import { Wrench, ArrowRight, ChevronRight } from 'lucide-react';
import SafeImage from '../../../components/common/SafeImage';

export default function UpcomingMaintenanceCard({
  displayedMaintenance,
  onNavigate,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 xl:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#075EE8]">
            <Wrench className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[#0A1E42] text-sm">Upcoming Maintenance</h3>
        </div>
        <button
          onClick={() => onNavigate('maintenance')}
          className="text-xs font-semibold text-[#075EE8] hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {displayedMaintenance.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate('maintenance')}
            className="flex items-center justify-between gap-3 p-2.5 hover:bg-slate-50/90 rounded-xl cursor-pointer group transition-all duration-200 hover:translate-x-1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <SafeImage
                src={item.image}
                alt={item.vehicle}
                type="vehicle"
                className="w-12 h-8 object-cover rounded-lg border border-slate-100 shrink-0 transition-transform duration-200 group-hover:scale-108"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0A1E42] group-hover:text-[#075EE8] transition-colors truncate">
                  {item.vehicle}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{item.type}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-xs font-bold ${
                  item.isUrgent ? 'text-rose-500' : 'text-slate-500'
                }`}
              >
                {item.date}
              </span>
              {item.isUrgent && (
                <ChevronRight className="w-3.5 h-3.5 text-rose-500 inline ml-1 animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

