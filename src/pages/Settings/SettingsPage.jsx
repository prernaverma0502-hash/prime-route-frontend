import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  FileText,
  Bell,
  Layers,
  Tags,
  CheckCircle2
} from 'lucide-react';
import { initialSettings } from '../../data/mockData';
import GeneralSettingsTab from './components/GeneralSettingsTab';
import UsersAndRolesPage from '../Users/UsersAndRolesPage';
import AuditLogTab from './components/AuditLogTab';
import NotificationsSettingsTab from './components/NotificationsSettingsTab';
import IntegrationsTab from './components/IntegrationsTab';
import StatusesAndCategoriesTab from './components/StatusesAndCategoriesTab';

const SETTINGS_SUBTABS = [
  { id: 'general', label: 'General', icon: Building, description: 'Company profile, branding, currency & oil change interval' },
  { id: 'users', label: 'Users & Roles', icon: Users, description: 'Staff directory & 7-role access permissions matrix' },
  { id: 'audit', label: 'Audit Log', icon: FileText, description: 'Tamper-proof event stream & data change ledger' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email/SMS triggers, lead times, deduplication & alert history' },
  { id: 'integrations', label: 'Integrations', icon: Layers, description: 'QuickBooks, payment gateways, e-signatures & Microsoft 365' },
  { id: 'categories', label: 'Statuses & Categories', icon: Tags, description: 'Vehicle statuses, expense categories & ticket review states' },
];

export default function SettingsPage({ activeSubTab, onSubTabChange }) {
  const [activeTab, setActiveTab] = useState(activeSubTab || 'general');
  const [settings, setSettings] = useState(initialSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (activeSubTab) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [name]: value },
    }));
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentTabObj = SETTINGS_SUBTABS.find((t) => t.id === activeTab) || SETTINGS_SUBTABS[0];
  const CurrentIcon = currentTabObj.icon;

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header with Title and Current Subtab Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">System Settings</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100 shadow-2xs flex items-center gap-1.5">
              <CurrentIcon className="w-3.5 h-3.5 text-[#075EE8]" />
              <span>{currentTabObj.label}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentTabObj.description}
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings updated successfully
          </div>
        )}
      </div>

      {/* Subtabs Navigation Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {SETTINGS_SUBTABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#075EE8] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab Contents Container */}
      <div className="w-full">
        {/* 1. General */}
        {activeTab === 'general' && (
          <GeneralSettingsTab
            settings={settings}
            onCompanyChange={handleCompanyChange}
            onSave={handleSave}
          />
        )}

        {/* 2. Users and Roles (Reusing existing UsersAndRolesPage) */}
        {activeTab === 'users' && (
          <div className="bg-transparent">
            <UsersAndRolesPage />
          </div>
        )}

        {/* 3. Audit Log */}
        {activeTab === 'audit' && <AuditLogTab />}

        {/* 4. Notifications */}
        {activeTab === 'notifications' && <NotificationsSettingsTab />}

        {/* 5. Integrations */}
        {activeTab === 'integrations' && <IntegrationsTab />}

        {/* 6. Statuses and Categories */}
        {activeTab === 'categories' && <StatusesAndCategoriesTab />}
      </div>
    </div>
  );
}
