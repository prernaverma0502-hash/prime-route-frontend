import React, { useState } from 'react';
import {
  Tags,
  Car,
  Receipt,
  Plus,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  X,
  ShieldCheck,
  Layers
} from 'lucide-react';
import {
  initialVehicleStatuses,
  initialExpenseCategoriesList,
  initialTicketStatuses
} from '../../../data/mockData';
import Modal from '../../../components/common/Modal';

export default function StatusesAndCategoriesTab() {
  const [activeSection, setActiveSection] = useState('vehicles'); // vehicles | expenses | tickets

  // Managed Lists State
  const [vehicleStatuses, setVehicleStatuses] = useState(initialVehicleStatuses);
  const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategoriesList);
  const [ticketStatuses, setTicketStatuses] = useState(initialTicketStatuses);

  // Modals State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Forms State
  const [newVehicleStatus, setNewVehicleStatus] = useState({
    name: '',
    color: 'blue',
    description: '',
    canRent: false,
    canIntake: true
  });

  const [newExpenseCategory, setNewExpenseCategory] = useState({
    code: '',
    name: '',
    taxDeductible: true,
    requiresApproval: true
  });

  const [newTicketStatus, setNewTicketStatus] = useState({
    name: '',
    stage: 'Review',
    chargeable: false,
    description: ''
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Vehicle Status
  const handleAddVehicleStatus = (e) => {
    e.preventDefault();
    if (!newVehicleStatus.name.trim()) return;
    const newEntry = {
      id: `VS-${Date.now()}`,
      name: newVehicleStatus.name.trim(),
      color: newVehicleStatus.color,
      description: newVehicleStatus.description || 'Custom administrative fleet status',
      canRent: newVehicleStatus.canRent,
      canIntake: newVehicleStatus.canIntake,
      isSystem: false
    };
    setVehicleStatuses((prev) => [...prev, newEntry]);
    setIsVehicleModalOpen(false);
    setNewVehicleStatus({ name: '', color: 'blue', description: '', canRent: false, canIntake: true });
    showToast(`Vehicle status "${newEntry.name}" added successfully.`);
  };

  // Add Expense Category
  const handleAddExpenseCategory = (e) => {
    e.preventDefault();
    if (!newExpenseCategory.name.trim()) return;
    const code = newExpenseCategory.code.trim().toUpperCase() || `EXP-${newExpenseCategory.name.slice(0, 3).toUpperCase()}`;
    const newEntry = {
      id: `EC-${Date.now()}`,
      code,
      name: newExpenseCategory.name.trim().toLowerCase(),
      taxDeductible: newExpenseCategory.taxDeductible,
      requiresApproval: newExpenseCategory.requiresApproval,
      status: 'Active'
    };
    setExpenseCategories((prev) => [...prev, newEntry]);
    setIsExpenseModalOpen(false);
    setNewExpenseCategory({ code: '', name: '', taxDeductible: true, requiresApproval: true });
    showToast(`Expense category "${newEntry.name}" added to accounting dictionary.`);
  };

  // Add Ticket Status
  const handleAddTicketStatus = (e) => {
    e.preventDefault();
    if (!newTicketStatus.name.trim()) return;
    const newEntry = {
      id: `TS-${Date.now()}`,
      name: newTicketStatus.name.trim(),
      stage: newTicketStatus.stage,
      chargeable: newTicketStatus.chargeable,
      description: newTicketStatus.description || 'Custom citation review state'
    };
    setTicketStatuses((prev) => [...prev, newEntry]);
    setIsTicketModalOpen(false);
    setNewTicketStatus({ name: '', stage: 'Review', chargeable: false, description: '' });
    showToast(`Ticket review workflow status "${newEntry.name}" added.`);
  };

  const getStatusColorBadge = (color, name) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'blue':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'rose':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'slate':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 shadow-2xs animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <Tags className="w-4 h-4 text-[#075EE8]" /> Admin-Managed Statuses &amp; Controlled Categories
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain controlled system classifications for vehicles, accounting expenses, and traffic citations
          </p>
        </div>

        {/* Section Switcher Chips */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSection('vehicles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'vehicles'
                ? 'bg-white text-[#0A1E42] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Vehicle Statuses ({vehicleStatuses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('expenses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'expenses'
                ? 'bg-white text-[#0A1E42] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tags className="w-3.5 h-3.5" />
            <span>Expense Categories ({expenseCategories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('tickets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'tickets'
                ? 'bg-white text-[#0A1E42] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Ticket Statuses ({ticketStatuses.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Vehicle Statuses Section */}
      {activeSection === 'vehicles' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0A1E42]">Controlled Vehicle Fleet Statuses</h4>
              <p className="text-xs text-slate-500">
                Governs rental agreement allocation, maintenance workflows, and public intake availability
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Vehicle Status
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Status Name</th>
                  <th className="py-3 px-3">Visual Chip</th>
                  <th className="py-3 px-3">Operational Scope &amp; Description</th>
                  <th className="py-3 px-3 text-center">Rental Eligible</th>
                  <th className="py-3 px-3 text-center">Intake Ready</th>
                  <th className="py-3 px-3 text-right">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleStatuses.map((vs) => (
                  <tr key={vs.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-3 font-black text-[#0A1E42] text-xs">{vs.name}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColorBadge(
                          vs.color,
                          vs.name
                        )}`}
                      >
                        {vs.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-sm">{vs.description}</td>
                    <td className="py-3.5 px-3 text-center">
                      {vs.canRent ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Blocked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {vs.canIntake ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          Allowed
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Restricted</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {vs.isSystem ? 'System Core' : 'Custom'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Expense Categories Section */}
      {activeSection === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0A1E42]">Controlled Expense Categories</h4>
              <p className="text-xs text-slate-500">
                16 controlled categories governing company expense entry, tax categorization, and approval enforcement
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">GL Account Code</th>
                  <th className="py-3 px-3">Category Name</th>
                  <th className="py-3 px-3 text-center">Tax Deductible</th>
                  <th className="py-3 px-3 text-center">Manager Approval Required</th>
                  <th className="py-3 px-3 text-right">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenseCategories.map((ec) => (
                  <tr key={ec.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{ec.code}</td>
                    <td className="py-3.5 px-3 font-black text-[#0A1E42] capitalize">{ec.name}</td>
                    <td className="py-3.5 px-3 text-center">
                      {ec.taxDeductible ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          ✓ Deductible
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Non-deductible</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {ec.requiresApproval ? (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          Required
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Auto-approved</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Ticket Review Statuses Section */}
      {activeSection === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0A1E42]">Controlled Ticket &amp; Violation Review Workflow</h4>
              <p className="text-xs text-slate-500">
                Six-stage controlled lifecycle before citations can be settled or billed to driver balances
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Ticket Status
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Lifecycle State</th>
                  <th className="py-3 px-3">Workflow Stage</th>
                  <th className="py-3 px-3">Audit Scope &amp; Processing Rules</th>
                  <th className="py-3 px-3 text-center">Driver Chargeable</th>
                  <th className="py-3 px-3 text-right">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ticketStatuses.map((ts) => (
                  <tr key={ts.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-3 font-black text-[#0A1E42]">{ts.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {ts.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-sm">{ts.description}</td>
                    <td className="py-3.5 px-3 text-center">
                      {ts.chargeable ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Review Hold</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Workflow Core
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Add Vehicle Status */}
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        title="Add Vehicle Fleet Status"
        subtitle="Introduce an administrative operational state for fleet inventory tracking"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddVehicleStatus} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status Name *</label>
            <input
              type="text"
              required
              value={newVehicleStatus.name}
              onChange={(e) => setNewVehicleStatus((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Staged at Detailer"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color Palette</label>
            <select
              value={newVehicleStatus.color}
              onChange={(e) => setNewVehicleStatus((p) => ({ ...p, color: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            >
              <option value="emerald">Emerald Green (Operational)</option>
              <option value="blue">Blue (Reserved / Transit)</option>
              <option value="indigo">Indigo (Commercial Deployment)</option>
              <option value="amber">Amber (Maintenance Warning)</option>
              <option value="rose">Rose Red (Unavailable / Blocked)</option>
              <option value="slate">Slate Gray (Decommissioned)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Operational Description</label>
            <textarea
              rows={2}
              value={newVehicleStatus.description}
              onChange={(e) => setNewVehicleStatus((p) => ({ ...p, description: e.target.value }))}
              placeholder="Explain when vehicles enter this status..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newVehicleStatus.canRent}
                onChange={(e) => setNewVehicleStatus((p) => ({ ...p, canRent: e.target.checked }))}
                className="rounded text-[#075EE8]"
              />
              <span>Vehicles in this status can be rented</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newVehicleStatus.canIntake}
                onChange={(e) => setNewVehicleStatus((p) => ({ ...p, canIntake: e.target.checked }))}
                className="rounded text-[#075EE8]"
              />
              <span>Allowed in intake staging queue</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#075EE8] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Create Vehicle Status
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Expense Category */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add Expense Category"
        subtitle="Define GL classification and managerial review rules"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddExpenseCategory} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={newExpenseCategory.name}
              onChange={(e) => setNewExpenseCategory((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. detailing, aerodynamic wash"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">GL Account Code</label>
            <input
              type="text"
              value={newExpenseCategory.code}
              onChange={(e) => setNewExpenseCategory((p) => ({ ...p, code: e.target.value }))}
              placeholder="e.g. EXP-DET"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newExpenseCategory.taxDeductible}
                onChange={(e) => setNewExpenseCategory((p) => ({ ...p, taxDeductible: e.target.checked }))}
                className="rounded text-[#075EE8]"
              />
              <span>Tax Deductible Fleet Expense</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newExpenseCategory.requiresApproval}
                onChange={(e) => setNewExpenseCategory((p) => ({ ...p, requiresApproval: e.target.checked }))}
                className="rounded text-[#075EE8]"
              />
              <span>Managerial Approval Required before payout</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#075EE8] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Create Expense Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add Ticket Status */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Add Ticket Workflow Status"
        subtitle="Configure citation processing lifecycle state"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddTicketStatus} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status Title *</label>
            <input
              type="text"
              required
              value={newTicketStatus.name}
              onChange={(e) => setNewTicketStatus((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Sent to Hearing"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Workflow Stage</label>
            <select
              value={newTicketStatus.stage}
              onChange={(e) => setNewTicketStatus((p) => ({ ...p, stage: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            >
              <option value="Intake">Intake (Imported from Tag)</option>
              <option value="Review">Review (Telematics Audit)</option>
              <option value="Matched">Matched (Associated to Driver)</option>
              <option value="Billing">Billing (Charged to Balance)</option>
              <option value="Settled">Settled (Fine Paid)</option>
              <option value="Adjudication">Adjudication (Legal Appeal)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scope Description</label>
            <textarea
              rows={2}
              value={newTicketStatus.description}
              onChange={(e) => setNewTicketStatus((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe ticket condition in this state..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newTicketStatus.chargeable}
                onChange={(e) => setNewTicketStatus((p) => ({ ...p, chargeable: e.target.checked }))}
                className="rounded text-[#075EE8]"
              />
              <span>Can charge driver balance in this state</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#075EE8] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Create Ticket Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

