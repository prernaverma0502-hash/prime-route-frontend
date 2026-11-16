import React from 'react';

export default function NotificationsTab() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-5">
      <div>
        <h3 className="text-base font-bold text-[#0A1E42]">Automated Alert Thresholds</h3>
        <p className="text-xs text-slate-500">System warning triggers matching dashboard alert widgets</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
          <div>
            <p className="text-xs font-bold text-[#0A1E42]">Lease Contract Expiry Alert Window</p>
            <p className="text-[11px] text-slate-400">Trigger dashboard warning before lease end date</p>
          </div>
          <span className="text-xs font-bold text-[#075EE8] bg-blue-50 px-2.5 py-1 rounded-lg">Next 7 Days</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
          <div>
            <p className="text-xs font-bold text-[#0A1E42]">Maintenance / Oil Change Alert Window</p>
            <p className="text-[11px] text-slate-400">Trigger warning when vehicle reaches 5,000 mi milestone</p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">Next 7 Days</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
          <div>
            <p className="text-xs font-bold text-[#0A1E42]">Compliance Document Expiry Alert Window</p>
            <p className="text-[11px] text-slate-400">Alert for driver license, registration & insurance</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Next 30 Days</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
          <div>
            <p className="text-xs font-bold text-[#0A1E42]">Unpaid Traffic Citations Notification</p>
            <p className="text-[11px] text-slate-400">Immediately surface citations logged to fleet tags</p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">Real-time (Active)</span>
        </div>
      </div>
    </div>
  );
}

