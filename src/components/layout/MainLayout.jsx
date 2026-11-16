import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import RolePreviewBanner from './RolePreviewBanner';
import RoleSwitcherModal from '../common/RoleSwitcherModal';

export default function MainLayout({
  activeMenu,
  settingsSubTab,
  onNavigate,
  onLogout,
  children
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F7FF] flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeMenu={activeMenu}
          settingsSubTab={settingsSubTab}
          onNavigate={onNavigate}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onToggleSidebar={() => {
              if (window.innerWidth < 768) {
                setIsMobileOpen(!isMobileOpen);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />

          {/* Role Preview Banner for Client Testing */}
          <RolePreviewBanner onOpenSwitcher={() => setIsSwitcherOpen(true)} />

          {/* Page Body Viewport */}
          <main className="flex-1 p-3 sm:p-4 xl:p-6 2xl:p-7 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* Global Role Switcher Modal Triggerable from Banner */}
          <RoleSwitcherModal
            isOpen={isSwitcherOpen}
            onClose={() => setIsSwitcherOpen(false)}
            onRoleSwitched={() => onNavigate('dashboard')}
          />
        </div>
      </div>
    </div>
  );
}
