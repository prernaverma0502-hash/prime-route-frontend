import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Briefcase,
  DollarSign,
  FileText,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { formatCurrency } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';
import Can from '../../auth/Can';
import VendorDetailsModal from './components/VendorDetailsModal';
import { initialVendors, initialExpenses } from '../../data/mockData';
import { useFleet } from '../../context/FleetContext';

const SERVICE_CATEGORIES = [
  { id: 'All', label: 'All Services' },
  { id: 'repairs', label: 'Repairs & Mechanical' },
  { id: 'other', label: 'Fuel & EV Charging' },
  { id: 'insurance', label: 'Insurance & Underwriting' },
  { id: 'tires', label: 'Tires & Alignment' },
  { id: 'tolls', label: 'Tolls & Transponders' },
  { id: 'software', label: 'Software & Telematics' },
  { id: 'towing', label: 'Towing & Roadside' },
  { id: 'cleaning', label: 'Detailing & Wash' }
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'repairs',
    services: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    terms: 'Net 30',
    notes: ''
  });

  // Filter vendors based on search and filters (Requirement 6)
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.services && v.services.toLowerCase().includes(q)) ||
        (v.contact && v.contact.toLowerCase().includes(q)) ||
        (v.phone && v.phone.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.address && v.address.toLowerCase().includes(q)) ||
        (v.notes && v.notes.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === 'All' || v.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' || v.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [vendors, searchQuery, categoryFilter, statusFilter]);

  // Overall metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => (v.status || '').includes('Active')).length;
  const totalSpendYTD = vendors.reduce((sum, v) => sum + Number(v.spendYTD || 0), 0);

  // Requirement 6: Export CSV
  const handleExport = () => {
    exportToCsv('PrimeRoute_Vendors_Directory', filteredVendors);
  };

  const handleCreateVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.contact) return;

    const vendorRecord = {
      id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
      name: newVendor.name,
      category: newVendor.category,
      services: newVendor.services || 'General Fleet Support',
      contact: newVendor.contact,
      phone: newVendor.phone,
      email: newVendor.email,
      address: newVendor.address,
      terms: newVendor.terms || 'Net 30',
      notes: newVendor.notes,
      spendYTD: 0,
      status: 'Active Partner'
    };

    setVendors([vendorRecord, ...vendors]);
    setIsAddVendorOpen(false);
    setNewVendor({
      name: '',
      category: 'repairs',
      services: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
      terms: 'Net 30',
      notes: ''
    });
    setNotification(`Vendor ${vendorRecord.name} onboarded into approved vendor directory.`);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">Vendors &amp; Suppliers Directory</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-[#075EE8] border border-blue-100 shadow-2xs">
              {filteredVendors.length} Registered Partners
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Approved body repair shops, parts distributors, fuel programs, commercial underwriters, and municipal tollway gateways
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Directory CSV</span>
          </button>

          <Can module="vendors" do="add">
            <button
              onClick={() => setIsAddVendorOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Vendor</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Ephemeral Feedback Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 rounded-xl flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-slate-600">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Approved Vendors
            </span>
            <Building2 className="w-4 h-4 text-[#075EE8]" />
          </div>
          <div className="text-2xl font-black text-[#0A1E42] font-mono">{totalVendors}</div>
          <p className="text-[10px] text-slate-400">Commercial enterprise partners</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Service Hubs
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">{activeVendors}</div>
          <p className="text-[10px] text-emerald-600">In good standing with contracts</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cumulative Spend (YTD)
            </span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">{formatCurrency(totalSpendYTD)}</div>
          <p className="text-[10px] text-slate-400">Total vendor disbursements</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Standard Terms
            </span>
            <ShieldCheck className="w-4 h-4 text-[#075EE8]" />
          </div>
          <div className="text-2xl font-black text-[#0A1E42] font-mono">Net 30</div>
          <p className="text-[10px] text-slate-400">Automated ACH &amp; Escrow clearing</p>
        </div>
      </div>

      {/* Directory Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden space-y-4">
        {/* Table Filter & Search Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC]">
          {/* Service Categories Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#075EE8] text-white shadow-2xs font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor name, contact, address..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
              />
            </div>
          </div>
        </div>

        {/* Directory Table (Requirement 6) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Vendor &amp; ID</th>
                <th className="py-3.5 px-4">Services Provided</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Phone &amp; Email</th>
                <th className="py-3.5 px-4">Physical Address</th>
                <th className="py-3.5 px-4">Payment Terms</th>
                <th className="py-3.5 px-4 text-right">Spend (YTD)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No vendors match your search.</p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-blue-50/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedVendor(v)}
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#0A1E42] block text-sm group-hover:text-[#075EE8] transition-colors">
                        {v.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{v.id}</span>
                    </td>

                    {/* Services */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-[200px]">
                      <span className="font-medium block">{v.services}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{v.category}</span>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {v.contact}
                    </td>

                    {/* Phone & Email */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{v.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{v.email}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={v.address}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{v.address}</span>
                      </div>
                    </td>

                    {/* Terms */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {v.terms || 'Net 30'}
                      </span>
                    </td>

                    {/* Spend YTD */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#0A1E42] font-mono">
                      {formatCurrency(v.spendYTD || 0)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={v.status || 'Active Partner'} />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedVendor(v)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#075EE8]/10 hover:bg-[#075EE8] text-[#075EE8] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        title="View Vendor Dossier with Invoices, Payments & Spending History"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement 7: Vendor Details Modal with Tabs: Invoices, Payments, Spending History */}
      <VendorDetailsModal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        vendor={selectedVendor}
        allExpenses={initialExpenses}
        allPayables={[]}
      />

      {/* Onboard Vendor Modal */}
      <Modal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        title="Onboard New Fleet Vendor / Service Partner"
        subtitle="Register commercial repair facility, parts jobber, or municipal agency into approved vendor master"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateVendor} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Company / Vendor Name"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              placeholder="e.g. Apex Collision Center"
              required
            />
            <FormSelect
              label="Primary Service Category"
              value={newVendor.category}
              onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
              options={[
                'repairs',
                'tires',
                'other',
                'insurance',
                'tolls',
                'software',
                'towing',
                'cleaning'
              ]}
            />
          </div>

          <FormInput
            label="Specific Services Provided"
            value={newVendor.services}
            onChange={(e) => setNewVendor({ ...newVendor, services: e.target.value })}
            placeholder="e.g. Frame straightening, paint booths, aluminum body repair"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="Contact Representative"
              value={newVendor.contact}
              onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
              placeholder="e.g. Frank Castle"
              required
            />
            <FormInput
              label="Phone Number"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              required
            />
            <FormInput
              label="Billing Email"
              type="email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              placeholder="billing@vendor.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Physical Service Facility Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              placeholder="123 Industrial Pkwy, City, State ZIP"
              required
            />
            <FormSelect
              label="Agreed Credit Terms"
              value={newVendor.terms}
              onChange={(e) => setNewVendor({ ...newVendor, terms: e.target.value })}
              options={['Net 30', 'Net 15', 'Net 20 Auto-Debit', 'Quarterly ACH', 'Weekly Account', 'Due Upon Receipt']}
            />
          </div>

          <FormTextarea
            label="Vendor Profile Notes / Contract Agreements"
            value={newVendor.notes}
            onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
            placeholder="Special commercial rates, insurance policy details, warranty agreements..."
            rows={2}
          />

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddVendorOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register Vendor Partner</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

