import React from 'react';
import { User, Settings, ShieldCheck, LogOut } from 'lucide-react';

export default function ProfileDropdown({ isOpen, onClose, onNavigate, onLogout, onOpenProfile }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="px-4 py-3 bg-[#F8FAFC] border-b border-slate-100">
          <p className="text-xs font-bold text-[#0A1E42]">John Doe</p>
          <p className="text-[11px] text-slate-500">john.doe@primeroute.io</p>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Administrator Privileges
          </div>
        </div>

        <div className="p-1.5 text-xs text-[#0A1E42]">
          <button
            onClick={() => {
              onClose();
              if (onOpenProfile) onOpenProfile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left font-medium transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-[#075EE8]" />
            <span className="font-semibold text-slate-800">Profile Details</span>
          </button>
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
          <button
            onClick={() => {
              onClose();
              onNavigate('documents');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Compliance Docs
          </button>
        </div>

        <div className="p-1.5 border-t border-slate-100 bg-[#F8FAFC]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold text-left transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

