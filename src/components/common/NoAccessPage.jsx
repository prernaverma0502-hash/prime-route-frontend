import React from 'react';
import { ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function NoAccessPage({ moduleName = 'Module', onNavigateHome, onOpenRoleSwitcher }) {
  const { activeRole, returnToAdmin } = useRole();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(7,29,73,0.06)] text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            Access Restricted (403)
          </span>
          <h2 className="text-xl font-black text-[#0A1E42] mt-3">
            {moduleName} Not Accessible
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your current role <strong className="text-[#0A1E42]">{activeRole.name}</strong> does not have permission to view or administer the <strong className="text-[#075EE8]">{moduleName}</strong> module.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-1.5 text-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Current Role:</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${activeRole.badgeColor}`}>
              {activeRole.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Policy:</span>
            <span className="font-medium text-slate-700">Strict RBAC Enforced</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>

          {onOpenRoleSwitcher && (
            <button
              type="button"
              onClick={onOpenRoleSwitcher}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Switch Role (Demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

