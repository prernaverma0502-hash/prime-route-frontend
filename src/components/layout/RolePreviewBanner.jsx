import React from 'react';
import { Sparkles, RotateCcw, Eye } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function RolePreviewBanner({ onOpenSwitcher }) {
  const { currentRoleId, activeRole, returnToAdmin } = useRole();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  if (!isDemoMode || currentRoleId === 'owner') {
    return null;
  }

  return (
    <aside
      aria-label="Testing Role Preview Banner"
      className="relative z-20 px-4 sm:px-6 py-2.5 border-b shadow-xs transition-colors duration-200 bg-[#071D49] text-blue-100 border-blue-950"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30">
            <Eye className="w-3 h-3" />
            Demo Mode
          </span>
          <p className="font-medium text-slate-200">
            Previewing as <strong className="text-white font-bold">{activeRole.name}</strong> ({activeRole.fullName}). In production, roles are enforced by the backend.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSwitcher}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            Switch Role
          </button>

          <button
            type="button"
            onClick={returnToAdmin}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Return to Owner View
          </button>
        </div>
      </div>
    </aside>
  );
}
