import React, { useState } from 'react';
import {
  Settings,
  Building,
  Users,
  Shield,
  Bell,
  Car,
  CreditCard,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Edit2,
  FileText,
  Tags,
  Briefcase,
  Check,
  X,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { FormInput, FormSelect } from '../../components/forms/FormInputs';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { initialSettings } from '../../data/mockData';

export default function SettingsPage({ activeSubTab, onSubTabChange }) {
  const [activeTab, setActiveTab] = useState(activeSubTab || 'general');
  const [settings, setSettings] = useState(initialSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (activeSubTab) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // User modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Fleet Manager',
    status: 'Active',
  });

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [name]: value },
    }));
  };

  const handleNotificationToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      setSettings((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === editingUser.id ? { ...u, ...newUser } : u
        ),
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        users: [
          ...prev.users,
          {
            ...newUser,
            id: Date.now(),
            lastLogin: 'Never',
          },
        ],
      }));
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Fleet Manager', status: 'Active' });
  };

  const handleDeleteUser = (id) => {
    setSettings((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
    }));
  };

  const tabs = [
    { id: 'general', label: 'Company Profile', icon: Building },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: '7 Role Permissions Matrix', icon: Shield },
    { id: 'vendors', label: 'Vendors Directory', icon: Briefcase },
    { id: 'categories', label: 'Categories & Dictionaries', icon: Tags },
    { id: 'audit', label: 'Immutable Audit Trail', icon: FileText },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
  ];

  const [vendors, setVendors] = useState([
    { id: 'VND-001', name: 'Speedy Pro Auto Clinic', category: 'Mechanical & Brakes', contact: 'Mike Torres', phone: '+1 (555) 392-1029', email: 'service@speedypro.com', terms: 'Net 30', spendYTD: 14250, status: 'Active Partner' },
    { id: 'VND-002', name: 'Chevy Certified Service Center', category: 'OEM Dealership Service', contact: 'Dana Scully', phone: '+1 (555) 441-9281', email: 'fleet@chevydealer.com', terms: 'Net 15', spendYTD: 8400, status: 'Active Partner' },
    { id: 'VND-003', name: 'Travelers Commercial Insurance', category: 'Insurance Underwriter', contact: 'Robert Vance', phone: '+1 (555) 902-8833', email: 'claims@travelers.com', terms: 'Quarterly ACH', spendYTD: 28900, status: 'Active Policy' },
    { id: 'VND-004', name: 'Goodyear Commercial Fleet Hub', category: 'Tires & Wheel Alignment', contact: 'Chris Paul', phone: '+1 (555) 773-1928', email: 'sales@goodyearfleet.com', terms: 'Instant / Net 30', spendYTD: 5200, status: 'Active Partner' },
    { id: 'VND-005', name: 'MTA / E-ZPass Commercial Accounts', category: 'Tollways & Municipal', contact: 'Toll Operations Desk', phone: '+1 (555) 201-9988', email: 'ezpass@mtabridges.org', terms: 'Auto-Debit Escrow', spendYTD: 12600, status: 'Active Gateway' },
  ]);

  const [vehicleCategories, setVehicleCategories] = useState([
    { id: 1, name: 'Sedan', description: 'Standard 4-door passenger sedans (Camry, Accord, Sonata)', count: 28, status: 'Active' },
    { id: 2, name: 'SUV', description: 'Full-size and mid-size sport utility vehicles (Tahoe, Explorer)', count: 18, status: 'Active' },
    { id: 3, name: 'Electric (EV)', description: 'Battery electric fleet vehicles (Tesla Model 3, Model Y)', count: 10, status: 'Active' },
    { id: 4, name: 'Luxury / Executive', description: 'Premium executive chauffeured sedans (BMW 5 Series, Mercedes E-Class)', count: 5, status: 'Active' },
    { id: 5, name: 'Commercial Truck', description: 'Light-duty cargo and payload haulers (Ford F-150)', count: 4, status: 'Active' },
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, code: 'EXP-FUEL', name: 'Fleet Fuel & EV Fast Charging', taxDeductible: true, requiresApproval: false },
    { id: 2, code: 'EXP-MNT', name: 'Routine & Corrective Maintenance', taxDeductible: true, requiresApproval: true },
    { id: 3, code: 'EXP-INS', name: 'Commercial Insurance Premiums', taxDeductible: true, requiresApproval: true },
    { id: 4, code: 'EXP-PARTS', name: 'Spare Parts, Tires & Fluids', taxDeductible: true, requiresApproval: true },
    { id: 5, code: 'EXP-TOLL', name: 'E-ZPass Tollway Pre-funding', taxDeductible: true, requiresApproval: false },
    { id: 6, code: 'EXP-LEGAL', name: 'Municipal Violations & Legal Representation', taxDeductible: false, requiresApproval: true },
  ]);

  const auditLogs = [
    { id: 'AUD-88190', time: 'Today, 10:42 AM', user: 'John Doe (Admin 1)', action: 'EXPENSE_APPROVED', module: 'Accounting', recordId: 'EXP-1041 ($4,250)', notes: 'Approved Shell Fleet Solutions bulk card invoice.' },
    { id: 'AUD-88189', time: 'Today, 09:30 AM', user: 'Marcus Brody (Fleet Tech)', action: 'INSPECTION_CREATED', module: 'Inspections', recordId: 'INSP-8819', notes: 'Completed vehicle check-out handover for Toyota Camry (PR-2024-TC).' },
    { id: 'AUD-88188', time: 'Yesterday, 04:15 PM', user: 'John Doe (Admin 1)', action: 'CITATION_RECHARGED', module: 'Tolls & Tickets', recordId: 'TCK-8901 ($90.00)', notes: 'Charged fine + $15 admin processing fee to Sarah Jenkins balance.' },
    { id: 'AUD-88187', time: 'Jul 10, 2025 02:20 PM', user: 'Lisa Ray (Ops)', action: 'CONTRACT_STATUS_CHANGE', module: 'Rentals', recordId: 'RNT-2025-001', notes: 'Updated status from Awaiting Signature to Active upon e-signature.' },
    { id: 'AUD-88186', time: 'Jul 08, 2025 11:00 AM', user: 'Michael Chang (Finance)', action: 'ESCROW_DEDUCTION', module: 'Accounting', recordId: 'ESC-002 ($90.00)', notes: 'Deducted unpaid citation penalty from David Miller security deposit.' },
  ];

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">System Configuration</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100 shadow-sm flex items-center gap-1.5">
              {(() => {
                const current = tabs.find((t) => t.id === activeTab);
                if (!current) return null;
                const CurrentIcon = current.icon;
                return (
                  <>
                    <CurrentIcon className="w-3.5 h-3.5 text-[#075EE8]" />
                    <span>{current.label}</span>
                  </>
                );
              })()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise company profile, staff role access, alert thresholds &amp; security policies
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes saved successfully!
          </div>
        )}
      </div>

      {/* Full-Width Settings Content Container */}
      <div className="w-full">
        {/* TAB 1: Company Profile */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)]">
              <h3 className="text-base font-bold text-[#0A1E42] mb-1">Company Profile</h3>
              <p className="text-xs text-slate-500 mb-6">Business identity used on customer invoices and official lease agreements</p>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Company Legal Name"
                    name="name"
                    value={settings.company.name}
                    onChange={handleCompanyChange}
                    required
                  />

                  <FormInput
                    label="Corporate Tagline"
                    name="tagline"
                    value={settings.company.tagline}
                    onChange={handleCompanyChange}
                  />

                  <FormInput
                    label="Support / Billing Email"
                    name="email"
                    type="email"
                    value={settings.company.email}
                    onChange={handleCompanyChange}
                    required
                  />

                  <FormInput
                    label="Corporate Phone"
                    name="phone"
                    value={settings.company.phone}
                    onChange={handleCompanyChange}
                  />

                  <FormInput
                    label="Official Website"
                    name="website"
                    value={settings.company.website}
                    onChange={handleCompanyChange}
                  />

                  <FormInput
                    label="Tax Employer ID (EIN)"
                    name="taxId"
                    value={settings.company.taxId}
                    onChange={handleCompanyChange}
                  />

                  <FormInput
                    label="Default Currency"
                    name="currency"
                    value={settings.company.currency}
                    onChange={handleCompanyChange}
                  />

                  <FormInput
                    label="Default Timezone"
                    name="timezone"
                    value={settings.company.timezone}
                    onChange={handleCompanyChange}
                  />
                </div>

                <FormInput
                  label="Headquarters Street Address"
                  name="address"
                  value={settings.company.address}
                  onChange={handleCompanyChange}
                />

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Profile Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: User Management */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0A1E42]">User Management</h3>
                  <p className="text-xs text-slate-500">Manage administrator and dispatch staff logins</p>
                </div>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setNewUser({ name: '', email: '', role: 'Fleet Manager', status: 'Active' });
                    setIsUserModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#075EE8] text-white text-xs font-bold rounded-xl hover:bg-[#0650C7] flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {settings.users.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/20">
                        <td className="py-3.5 px-4 font-bold text-[#0A1E42]">{u.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#075EE8]">{u.role}</td>
                        <td className="py-3.5 px-4"><StatusBadge status={u.status} /></td>
                        <td className="py-3.5 px-4 text-slate-400">{u.lastLogin}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setNewUser({ name: u.name, email: u.email, role: u.role, status: u.status });
                                setIsUserModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-[#075EE8] rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Roles & Permissions (7 Client PDF Roles) */}
          {activeTab === 'roles' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0A1E42]">Client Defined 7-Role Permission Hierarchy</h3>
                <p className="text-xs text-slate-500">Strictly mapped to PrimeRoute Database Project Outline specifications</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: '1. Administrator 1 (Owner)',
                    desc: 'Unrestricted system root access, owner oversight, audit log review, role configuration, master security overrides.',
                    badge: 'Full Root Privileges',
                    color: 'bg-purple-50 text-purple-700 border-purple-200'
                  },
                  {
                    title: '2. Administrator 2',
                    desc: 'Platform operations administrator, employee account management, configuration maintenance.',
                    badge: 'Operational Admin',
                    color: 'bg-blue-50 text-blue-700 border-blue-200'
                  },
                  {
                    title: '3. Finance Employee',
                    desc: 'Revenue, payment reconciliation, expense approvals, driver security deposit escrow, invoices and P&L audit.',
                    badge: 'Financial Controller',
                    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  },
                  {
                    title: '4. Fleet / Maintenance Employee',
                    desc: 'Vehicle additions, 5,000-mile routine oil intervals, repair shop work orders, and vehicle inventory.',
                    badge: 'Fleet Ops & Shop',
                    color: 'bg-amber-50 text-amber-700 border-amber-200'
                  },
                  {
                    title: '5. Rental / Operations Employee',
                    desc: 'Rental contracts, customer booking intake, driver assignment, handover check-in/check-out inspections.',
                    badge: 'Front-desk & Dispatch',
                    color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  },
                  {
                    title: '6. Manager',
                    desc: 'Supervisory oversight, contract extensions, expense reviews, incident/accident approvals, and executive reports.',
                    badge: 'Managerial Override',
                    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  },
                  {
                    title: '7. Read-Only User',
                    desc: 'Auditor, compliance officer, or external legal review. Full view-only capabilities with zero write/edit permissions.',
                    badge: 'Compliance & Audit',
                    color: 'bg-slate-100 text-slate-700 border-slate-200'
                  }
                ].map((role) => (
                  <div key={role.title} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#0A1E42]">{role.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{role.desc}</p>
                    </div>
                    <span className={`text-[11px] font-bold border px-2.5 py-1 rounded-full shrink-0 ${role.color}`}>
                      {role.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interactive Module Permissions Matrix Table */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0A1E42]">Role-Based Access Control (RBAC) Matrix</h4>
                    <p className="text-xs text-slate-500">Fine-grained operational permissions per business role</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ✓ Granular RBAC Active
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-2 text-center">Admin 1</th>
                        <th className="py-2.5 px-2 text-center">Admin 2</th>
                        <th className="py-2.5 px-2 text-center">Finance</th>
                        <th className="py-2.5 px-2 text-center">Fleet/Maint</th>
                        <th className="py-2.5 px-2 text-center">Rental/Ops</th>
                        <th className="py-2.5 px-2 text-center">Manager</th>
                        <th className="py-2.5 px-2 text-center">Read-Only</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        { module: 'Vehicles & Fleet Registry', a1: 'Full', a2: 'Full', fin: 'View', flt: 'Full', ops: 'View', mgr: 'Full', ro: 'View' },
                        { module: 'Driver Profiles & Documents', a1: 'Full', a2: 'Full', fin: 'View', flt: 'View', ops: 'Full', mgr: 'Full', ro: 'View' },
                        { module: 'Rental Contracts & Leasing', a1: 'Full', a2: 'Full', fin: 'Edit', flt: 'View', ops: 'Full', mgr: 'Approve', ro: 'View' },
                        { module: 'Check-in/Out Inspections', a1: 'Full', a2: 'Full', fin: 'None', flt: 'Full', ops: 'Full', mgr: 'Full', ro: 'View' },
                        { module: 'Invoicing & Deposit Escrow', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'None', ops: 'View', mgr: 'Full', ro: 'View' },
                        { module: 'Expense Entry & Approvals', a1: 'Full', a2: 'Full', fin: 'Approve', flt: 'Create', ops: 'Create', mgr: 'Approve', ro: 'View' },
                        { module: 'Tolls, Citations & Recharge', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'View', ops: 'Full', mgr: 'Full', ro: 'View' },
                        { module: 'Executive Reports & P&L', a1: 'Full', a2: 'Full', fin: 'Full', flt: 'View', ops: 'View', mgr: 'Full', ro: 'View' },
                        { module: 'Security Settings & Audit Logs', a1: 'Full', a2: 'Full', fin: 'None', flt: 'None', ops: 'None', mgr: 'View', ro: 'None' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{row.module}</td>
                          {[row.a1, row.a2, row.fin, row.flt, row.ops, row.mgr, row.ro].map((perm, pIdx) => (
                            <td key={pIdx} className="py-2.5 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                perm === 'Full' ? 'bg-purple-50 text-purple-700' :
                                perm === 'Approve' ? 'bg-emerald-50 text-emerald-700' :
                                perm === 'Edit' || perm === 'Create' ? 'bg-blue-50 text-blue-700' :
                                perm === 'View' ? 'bg-slate-100 text-slate-600' :
                                'text-slate-300'
                              }`}>
                                {perm === 'None' ? '—' : perm}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Vendors Directory */}
          {activeTab === 'vendors' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#075EE8]" /> Approved Fleet Vendors &amp; Partners
                  </h3>
                  <p className="text-xs text-slate-500">Service providers, mechanic body shops, insurance carriers &amp; municipal agencies</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                    5 Active Vendors
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto px-5 pb-5">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-3">Vendor ID</th>
                      <th className="py-3 px-3">Company &amp; Service</th>
                      <th className="py-3 px-3">Contact Person</th>
                      <th className="py-3 px-3">Contact Details</th>
                      <th className="py-3 px-3">Payment Terms</th>
                      <th className="py-3 px-3">Cumulative Spend (YTD)</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-blue-50/20">
                        <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{v.id}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#0A1E42] block">{v.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{v.category}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{v.contact}</td>
                        <td className="py-3 px-3 text-slate-600">
                          <p>{v.phone}</p>
                          <p className="text-[10px] text-slate-400">{v.email}</p>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">{v.terms}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">${v.spendYTD.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Categories & Dictionaries */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Vehicle Categories */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#075EE8]" /> Fleet Vehicle Classification Dictionary
                    </h3>
                    <p className="text-xs text-slate-500">Configured vehicle segments available during new vehicle onboarding</p>
                  </div>
                </div>
                <div className="overflow-x-auto px-5 pb-5">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                        <th className="py-3 px-3">Segment Name</th>
                        <th className="py-3 px-3">Description &amp; Models</th>
                        <th className="py-3 px-3">Active Units</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vehicleCategories.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-[#0A1E42]">{c.name}</td>
                          <td className="py-3 px-3 text-slate-600">{c.description}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{c.count} vehicles</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expense Category Codes */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
                      <Tags className="w-4 h-4 text-[#075EE8]" /> Expense Category Codes &amp; Accounting Rules
                    </h3>
                    <p className="text-xs text-slate-500">GL expense accounts and managerial approval enforcement rules</p>
                  </div>
                </div>
                <div className="overflow-x-auto px-5 pb-5">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                        <th className="py-3 px-3">Account Code</th>
                        <th className="py-3 px-3">Expense Category</th>
                        <th className="py-3 px-3">Tax Deductible</th>
                        <th className="py-3 px-3">Approval Required</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenseCategories.map((ec) => (
                        <tr key={ec.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{ec.code}</td>
                          <td className="py-3 px-3 font-bold text-[#0A1E42]">{ec.name}</td>
                          <td className="py-3 px-3">
                            {ec.taxDeductible ? (
                              <span className="text-emerald-600 font-bold">✓ Tax Deductible</span>
                            ) : (
                              <span className="text-slate-400">Non-deductible</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {ec.requiresApproval ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Manager Approval Enforced
                              </span>
                            ) : (
                              <span className="text-slate-500">Direct Entry Allowed</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active Code
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Immutable Audit Trail */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#075EE8]" /> System-Wide Immutable Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">Tamper-proof event logs recording user actions, timestamps, and data changes</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                  ● SHA-256 Verified
                </span>
              </div>

              <div className="overflow-x-auto px-5 pb-5">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-3">Log ID</th>
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Acting User &amp; Role</th>
                      <th className="py-3 px-3">Event Action</th>
                      <th className="py-3 px-3">Module</th>
                      <th className="py-3 px-3">Target Record</th>
                      <th className="py-3 px-3">Audit Details &amp; Old/New Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/20">
                        <td className="py-3 px-3 font-mono font-bold text-[#075EE8]">{log.id}</td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{log.time}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{log.user}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{log.module}</td>
                        <td className="py-3 px-3 font-mono font-bold text-[#0A1E42]">{log.recordId}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Alerts & Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0A1E42]">Automated Alert Thresholds</h3>
                <p className="text-xs text-slate-500">System warning triggers matching dashboard alert widgets</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-[#0A1E42]">Lease Contract Expiry Alert Window</p>
                    <p className="text-[11px] text-slate-400">Trigger dashboard warning before lease end date</p>
                  </div>
                  <span className="text-xs font-bold text-[#075EE8] bg-blue-50 px-2.5 py-1 rounded-lg">Next 7 Days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-[#0A1E42]">Maintenance / Oil Change Alert Window</p>
                    <p className="text-[11px] text-slate-400">Trigger warning when vehicle reaches 5,000 mi milestone</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">Next 7 Days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-[#0A1E42]">Compliance Document Expiry Alert Window</p>
                    <p className="text-[11px] text-slate-400">Alert for driver license, registration &amp; insurance</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Next 30 Days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-[#0A1E42]">Unpaid Traffic Citations Notification</p>
                    <p className="text-[11px] text-slate-400">Immediately surface citations logged to fleet tags</p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">Real-time (Active)</span>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Add New System User'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. Sarah Connor"
            required
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="s.connor@primeroute.io"
            required
          />
          <FormSelect
            label="Assigned Business Role"
            name="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              'Administrator 1 (Owner)',
              'Administrator 2',
              'Finance Employee',
              'Fleet / Maintenance Employee',
              'Rental / Operations Employee',
              'Manager',
              'Read-Only User'
            ]}
          />
          <FormSelect
            label="Account Status"
            name="status"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

