import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import VehiclesPage from './pages/Vehicles/VehiclesPage';
import DriversPage from './pages/Drivers/DriversPage';
import RentalsPage from './pages/Rentals/RentalsPage';
import InspectionsPage from './pages/Inspections/InspectionsPage';
import InsurancePage from './pages/Insurance/InsurancePage';
import AccountingPage from './pages/Accounting/AccountingPage';
import MaintenancePage from './pages/Maintenance/MaintenancePage';
import TollsTicketsPage from './pages/TollsTickets/TollsTicketsPage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import UsersAndRolesPage from './pages/Users/UsersAndRolesPage';
import VendorsPage from './pages/Vendors/VendorsPage';
import EmployeePaperworkPage from './pages/EmployeePaperwork/EmployeePaperworkPage';
import LoginPage from './pages/Auth/LoginPage';
import ConfirmationModal from './components/common/ConfirmationModal';
import NoAccessPage from './components/common/NoAccessPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { FleetProvider } from './context/FleetContext';
import { RoleProvider, useRole } from './context/RoleContext';

const MODULE_TITLES = {
  dashboard: 'Dashboard',
  vehicles: 'Vehicles',
  drivers: 'Drivers',
  rentals: 'Rentals & Contracts',
  inspections: 'Inspections & Audits',
  insurance: 'Insurance & Compliance',
  accounting: 'Accounting & Finance',
  vendors: 'Vendors & Partners',
  maintenance: 'Maintenance & Service',
  'tolls-tickets': 'Tolls & Violations',
  documents: 'Documents Repository',
  reports: 'Reports & Analytics',
  users: 'Users & Roles Management',
  settings: 'System Settings',
  'employee-paperwork': 'Employee Paperwork',
};

function AppContent({ onLogoutConfirm }) {
  const { currentRoleId, activeRole, isMenuAllowed, returnToAdmin } = useRole();
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

  const renderActiveModule = () => {
    // RBAC Route Guard: If role cannot view this module, render dedicated No Access Page
    if (!isMenuAllowed(activeMenu)) {
      return (
        <NoAccessPage
          moduleName={MODULE_TITLES[activeMenu] || 'Module'}
          onNavigateHome={() => handleNavigate('dashboard')}
          onOpenRoleSwitcher={returnToAdmin}
        />
      );
    }

    switch (activeMenu) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onViewVehicle={() => handleNavigate('vehicles')}
          />
        );
      case 'employee-paperwork':
        return <EmployeePaperworkPage />;
      case 'vehicles':
        return <VehiclesPage />;
      case 'drivers':
        return <DriversPage />;
      case 'rentals':
        return <RentalsPage />;
      case 'inspections':
        return <InspectionsPage />;
      case 'insurance':
        return <InsurancePage />;
      case 'accounting':
        return <AccountingPage />;
      case 'vendors':
        return <VendorsPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'tolls-tickets':
        return <TollsTicketsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return (
          <UsersAndRolesPage
            onNavigateHome={() => handleNavigate('dashboard')}
            onOpenRoleSwitcher={returnToAdmin}
          />
        );
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
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          onLogoutConfirm();
        }}
        title="Sign Out of PrimeRoute"
        message="Are you sure you want to end your current session? You will need to sign in again to access the fleet dashboard."
        confirmText="Sign Out"
        isDanger={false}
      />
    </MainLayout>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (roleId) => {
    if (roleId) {
      const validRoles = ['owner', 'secondary_admin', 'finance', 'fleet_maintenance', 'rental_operations', 'readonly_manager'];
      const normalized = roleId === 'admin' ? 'owner' : roleId === 'manager' ? 'rental_operations' : roleId === 'employee' ? 'fleet_maintenance' : roleId;
      if (validRoles.includes(normalized)) {
        try {
          localStorage.setItem('primeroute_active_role', normalized);
        } catch {
          // ignore
        }
      }
    }
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <RoleProvider>
      <FleetProvider>
        <ErrorBoundary>
          <AppContent onLogoutConfirm={() => setIsAuthenticated(false)} />
        </ErrorBoundary>
      </FleetProvider>
    </RoleProvider>
  );
}
