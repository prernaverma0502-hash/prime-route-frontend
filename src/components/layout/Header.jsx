import React, { useState } from 'react';
import { Bell, Menu, User, ChevronDown, CheckCircle2, Shield, Save } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import ProfileDropdown from '../common/ProfileDropdown';
import Modal from '../common/Modal';

export default function Header({
  onToggleSidebar,
  onNavigate,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@primeroute.io',
    phone: '+1 (555) 019-2834',
    location: 'HQ - New York Depot',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] flex items-center transition-all">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-[#075EE8] hover:bg-blue-50/80 rounded-xl transition-all active:scale-95 duration-150"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* PrimeRoute Branding (Logo visible on mobile when sidebar is hidden) */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/primeroute-logo.png"
              alt="PrimeRoute"
              className="h-9 w-auto object-contain md:hidden"
            />

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#071D49] group-hover:text-[#075EE8] transition-colors">
                  Prime<span className="text-[#075EE8]">Route</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight">
                Fleet Management &amp; Vehicle Leasing System
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Administrator Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-[#075EE8] hover:bg-blue-50/80 rounded-xl transition-all active:scale-95 duration-150 relative group"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                <span className="relative">3</span>
              </span>
            </button>

            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onNavigate={onNavigate}
            />
          </div>

          <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Admin User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 hover:bg-slate-50/90 rounded-xl transition-all text-left active:scale-98 duration-150"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="John Doe"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#075EE8]/20 transition-all hover:ring-[#075EE8]/50"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#0A1E42] leading-tight">John Doe</p>
                <p className="text-[10px] font-medium text-slate-500">Administrator</p>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200" />
            </button>

            <ProfileDropdown
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
              onNavigate={onNavigate}
              onLogout={onLogout}
              onOpenProfile={() => setShowProfileModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Personal Profile & Credentials Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Personal Profile & Access Rights"
        subtitle="Manage your administrator account details, role privileges and active session"
        maxWidth="max-w-lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
          }}
          className="space-y-4"
        >
          {/* Profile Header Banner */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-100">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                alt={adminProfile.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-[#0A1E42] text-base">{adminProfile.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#075EE8]">
                  Full Root Access
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{adminProfile.email}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Role: Administrator 1 (Owner)</span>
              </div>
            </div>
          </div>

          {profileSaved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-fade-in shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#075EE8] focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Primary Work Email</label>
              <input
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#075EE8] focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Direct Phone</label>
              <input
                type="text"
                value={adminProfile.phone}
                onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#075EE8] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Assigned Fleet Depot</label>
              <input
                type="text"
                value={adminProfile.location}
                onChange={(e) => setAdminProfile({ ...adminProfile, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#075EE8] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Security & Access Rights Overview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">System Hierarchy Role</span>
              <span className="font-bold text-[#075EE8]">Administrator 1 (Owner)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Multi-Factor Authentication (2FA)</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Enforced
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Audit Trail Logging</span>
              <span className="font-medium text-slate-700">All actions recorded to immutable log</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowProfileModal(false);
                onNavigate('settings', 'users');
              }}
              className="text-xs text-[#075EE8] font-bold hover:underline cursor-pointer"
            >
              Manage All Staff Accounts →
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </header>
  );
}
