import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CarFront,
  Users,
  KeyRound,
  ClipboardCheck,
  CircleDollarSign,
  Wrench,
  Receipt,
  Folders,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronDown,
  Building,
  Shield,
  Briefcase,
  Tags,
  FileText,
  Bell
} from 'lucide-react';

export default function Sidebar({
  activeMenu,
  settingsSubTab,
  onNavigate,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(activeMenu === 'settings');

  useEffect(() => {
    if (activeMenu === 'settings') {
      setIsSettingsOpen(true);
    }
  }, [activeMenu]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: CarFront },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'rentals', label: 'Rentals', icon: KeyRound },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
    { id: 'accounting', label: 'Accounting', icon: CircleDollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tolls-tickets', label: 'Tolls & Tickets', icon: Receipt },
    { id: 'documents', label: 'Documents', icon: Folders },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const settingsSubItems = [
    { id: 'general', label: 'Company Profile', icon: Building },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: '7 Role Permissions Matrix', icon: Shield },
    { id: 'vendors', label: 'Vendors Directory', icon: Briefcase },
    { id: 'categories', label: 'Categories & Dictionaries', icon: Tags },
    { id: 'audit', label: 'Immutable Audit Trail', icon: FileText },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === 'settings') {
      if (isCollapsed && onToggleCollapse) {
        onToggleCollapse();
      }
      if (activeMenu === 'settings') {
        setIsSettingsOpen((prev) => !prev);
      } else {
        setIsSettingsOpen(true);
        onNavigate('settings', settingsSubTab || 'general');
      }
    } else {
      setIsSettingsOpen(false);
      onNavigate(itemId);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogoutClick = () => {
    onLogout();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#071D49]/70 backdrop-blur-sm z-40 md:hidden animate-fade-in transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container (Sleek Compact Width - Always Visible on Desktop/Laptop) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#071D49] text-white z-50 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl select-none ${
          isCollapsed ? 'w-16' : 'w-48'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Logo Area (Seamless White Header Box) */}
        <div className="h-[68px] bg-white px-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 ${
              isCollapsed ? 'px-0' : 'px-1'
            }`}
          >
            {isCollapsed ? (
              <img
                src="/primeroute-logo-icon.png"
                alt="PrimeRoute"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <img
                src="/primeroute-logo.png"
                alt="PrimeRoute"
                className="h-11 w-auto max-w-[145px] object-contain"
              />
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dark Navy Lower Sidebar Section */}
        <div className="flex-1 flex flex-col justify-between border-r border-[#0D2D6C] overflow-hidden min-h-0">
          {/* Navigation Menu List with Compact Spacing */}
          <div className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSettings = item.id === 'settings';
              const isActive = activeMenu === item.id;

              if (isSettings) {
                return (
                  <div key={item.id} className="space-y-1 pt-0.5">
                    <button
                      onClick={() => handleMenuClick('settings')}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative active:scale-97 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#075EE8] to-[#1468EB] text-white shadow-[0_4px_16px_rgba(7,94,232,0.4)]'
                          : 'text-slate-300 hover:bg-white/[0.07] hover:text-white hover:translate-x-0.5'
                      } ${isCollapsed ? 'justify-center px-1 py-1.5' : ''}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/25'
                            : 'bg-white/[0.06] text-slate-300 group-hover:bg-white/[0.12] group-hover:text-white group-hover:scale-105'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                      </div>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}

                      {!isCollapsed && (
                        <ChevronDown
                          className={`ml-auto w-4 h-4 shrink-0 transition-transform duration-200 ${
                            isSettingsOpen
                              ? 'rotate-180 text-white'
                              : isActive
                              ? 'text-white/80'
                              : 'text-slate-400 group-hover:text-white'
                          }`}
                        />
                      )}
                    </button>

                    {/* Settings Dropdown Submenu */}
                    {isSettingsOpen && !isCollapsed && (
                      <div className="ml-2 pl-2 border-l-2 border-[#133A85] space-y-0.5 pt-0.5 pb-0.5 animate-fade-in">
                        {settingsSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive =
                            isActive &&
                            (settingsSubTab === sub.id || (!settingsSubTab && sub.id === 'general'));
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onNavigate('settings', sub.id);
                                if (onCloseMobile) onCloseMobile();
                              }}
                              title={sub.label}
                              className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] transition-all duration-150 text-left group cursor-pointer ${
                                isSubActive
                                  ? 'bg-[#075EE8] text-white font-bold shadow-sm'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                              }`}
                            >
                              <div
                                className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 transition-all duration-150 ${
                                  isSubActive
                                    ? 'bg-white/25 text-white'
                                    : 'bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                                }`}
                              >
                                <SubIcon className="w-3 h-3 shrink-0" strokeWidth={2} />
                              </div>
                              <span className="truncate">{sub.label}</span>
                              {isSubActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-sm" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative active:scale-97 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#075EE8] to-[#1468EB] text-white shadow-[0_4px_16px_rgba(7,94,232,0.4)]'
                      : 'text-slate-300 hover:bg-white/[0.07] hover:text-white hover:translate-x-0.5'
                  } ${isCollapsed ? 'justify-center px-1 py-1.5' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/25'
                        : 'bg-white/[0.06] text-slate-300 group-hover:bg-white/[0.12] group-hover:text-white group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                  </div>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Active Indicator bar */}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dedicated Pinned Logout at the Bottom */}
          <div className="p-2.5 border-t border-[#0D2D6C]/60 shrink-0">
            <button
              onClick={handleLogoutClick}
              title={isCollapsed ? 'Logout' : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group active:scale-97 cursor-pointer ${
                isCollapsed ? 'justify-center px-1 py-1.5' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 group-hover:text-rose-300 group-hover:scale-105 transition-all duration-200">
                <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
              </div>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
