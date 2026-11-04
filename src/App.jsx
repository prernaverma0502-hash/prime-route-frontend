import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import VehiclesPage from './pages/Vehicles/VehiclesPage';
import DriversPage from './pages/Drivers/DriversPage';
import RentalsPage from './pages/Rentals/RentalsPage';
import InspectionsPage from './pages/Inspections/InspectionsPage';
import AccountingPage from './pages/Accounting/AccountingPage';
import MaintenancePage from './pages/Maintenance/MaintenancePage';
import TollsTicketsPage from './pages/TollsTickets/TollsTicketsPage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import LoginPage from './pages/Auth/LoginPage';
import ConfirmationModal from './components/common/ConfirmationModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState('general');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleNavigate = (menuId, subTab = null) => {
    setActiveMenu(menuId);
    if (subTab) {
      setSettingsSubTab(subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    setIsLogoutDialogOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onViewVehicle={() => handleNavigate('vehicles')}
          />
        );
      case 'vehicles':
        return <VehiclesPage />;
      case 'drivers':
        return <DriversPage />;
      case 'rentals':
        return <RentalsPage />;
      case 'inspections':
        return <InspectionsPage />;
      case 'accounting':
        return <AccountingPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'tolls-tickets':
        return <TollsTicketsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return (
          <SettingsPage
            activeSubTab={settingsSubTab}
            onSubTabChange={(tab) => setSettingsSubTab(tab)}
          />
        );
      default:
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onViewVehicle={() => handleNavigate('vehicles')}
          />
        );
    }
  };

  return (
    <MainLayout
      activeMenu={activeMenu}
      settingsSubTab={settingsSubTab}
      onNavigate={handleNavigate}
      onLogout={() => setIsLogoutDialogOpen(true)}
    >
      {renderActiveModule()}

      {/* Global Logout Confirmation */}
      <ConfirmationModal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out of PrimeRoute"
        message="Are you sure you want to end your current session? You will need to sign in again to access the fleet dashboard."
        confirmText="Sign Out"
        isDanger={false}
      />
    </MainLayout>
  );
}

