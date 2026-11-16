import React from 'react';
import { User, Settings, ShieldCheck, LogOut, Users, Sparkles, RotateCcw } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function ProfileDropdown({
  isOpen,
  onClose,
  onNavigate,
  onLogout,
  onOpenProfile,
  onOpenRoleSwitcher
}) {
  const { currentRoleId, activeRole, returnToAdmin } = useRole();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Dynamic User Profile Header */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-b border-slate-100">
          <p className="text-xs font-bold text-[#0A1E42]">{activeRole.fullName}</p>
          <p className="text-[11px] text-slate-500">{activeRole.email}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold">
            <span className={`w-1.5 h-1.5 rounded-full ${
              currentRoleId === 'owner' ? 'bg-purple-500' : currentRoleId === 'secondary_admin' ? 'bg-blue-500' : currentRoleId === 'finance' ? 'bg-emerald-500' : 'bg-slate-400'
            }`} />
            <span className={
              currentRoleId === 'owner' ? 'text-purple-600' : currentRoleId === 'secondary_admin' ? 'text-blue-600' : currentRoleId === 'finance' ? 'text-emerald-600' : 'text-slate-600'
            }>
              {activeRole.badge}
            </span>
          </div>
        </div>

        {/* Action Menu List */}
        <div className="p-1.5 text-xs text-[#0A1E42]">
          {/* Switch User / Role Option (Demo Mode) */}
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <button
              onClick={() => {
                onClose();
                if (onOpenRoleSwitcher) onOpenRoleSwitcher();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 text-left font-bold text-[#075EE8] transition-colors cursor-pointer mb-1"
            >
              <Users className="w-4 h-4 text-[#075EE8]" />
              <span>Switch User / Role</span>
              <span className="ml-auto text-[9px] bg-[#075EE8] text-white px-1.5 py-0.5 rounded-md font-bold uppercase">
                Demo
              </span>
            </button>
          )}

          {import.meta.env.VITE_DEMO_MODE === 'true' && currentRoleId !== 'owner' && (
            <button
              onClick={() => {
                onClose();
                returnToAdmin();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-emerald-50 text-left font-semibold text-emerald-700 transition-colors cursor-pointer mb-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return to Owner View</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              if (onOpenProfile) onOpenProfile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left font-medium transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-slate-800">Profile Details</span>
          </button>

          {currentRoleId === 'owner' && (
            <button
              onClick={() => {
                onClose();
                onNavigate('settings', 'general');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left font-medium transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              System Settings
            </button>
          )}

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-left font-medium text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
