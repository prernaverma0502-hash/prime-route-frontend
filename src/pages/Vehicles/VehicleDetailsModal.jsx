import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Shield,
  Gauge,
  Fuel,
  Settings2,
  DollarSign,
  User,
  Wrench,
  FileText,
  Clock,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Info,
  Download,
  Eye,
  CheckCircle2,
  Archive,
  Trash2,
  Edit2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Can from '../../auth/Can';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  getVehicleRentals,
  getVehicleDriverHistory,
  getVehicleMaintenance,
  getVehicleDocuments,
  getVehicleExpenses,
  getVehicleProfitability,
} from './vehicleDataHelpers';

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onArchive,
  onDelete,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDocPreview, setActiveDocPreview] = useState(null);

  if (!isOpen || !vehicle) return null;

  // Retrieve calculated helper models for this specific vehicle
  const rentals = getVehicleRentals(vehicle);
  const driverHistory = getVehicleDriverHistory(vehicle);
  const maintenanceRecords = getVehicleMaintenance(vehicle);
  const documents = getVehicleDocuments(vehicle);
  const expensesData = getVehicleExpenses(vehicle);
  const profitability = getVehicleProfitability(vehicle);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Car },
    { id: 'rentals', label: 'Rental History', icon: Calendar, count: rentals.length },
    { id: 'drivers', label: 'Driver Assignment History', icon: Clock, count: driverHistory.length },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, count: maintenanceRecords.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'profitability', label: 'Profitability', icon: TrendingUp },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle.name}
      subtitle={`ID: ${vehicle.id} • Plate: ${vehicle.plate} • VIN: ${vehicle.vin || 'N/A'}`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0A2763] to-[#0D3685] rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              onError={(e) => {
                e.currentTarget.src = '/placeholders/vehicle-default.svg';
              }}
              className="w-32 h-20 sm:w-36 sm:h-24 object-cover rounded-xl border-2 border-white/20 shadow-md shrink-0"
            />
            <div className="text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <StatusBadge status={vehicle.status} />
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-medium text-blue-100">
                  {vehicle.type || 'Sedan'}
                </span>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-blue-200">
                  {vehicle.plate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white truncate">{vehicle.name}</h2>
              <p className="text-slate-300 text-xs mt-0.5">
                {vehicle.year} • {vehicle.make} {vehicle.model} • Color: {vehicle.color || 'Standard'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 z-10 shrink-0">
            <Can module="vehicles" do="edit">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(vehicle);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-200" />
                Edit Vehicle
              </button>
            </Can>
            <Can module="vehicles" do="archive">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onArchive(vehicle);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-all border border-amber-400/30 cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-amber-300" />
                Archive
              </button>
            </Can>
            {onDelete && (
              <Can module="vehicles" do="archive">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(vehicle);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all border border-rose-400/30 cursor-pointer"
                  title="Remove vehicle from fleet"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  Remove
                </button>
              </Can>
            )}
          </div>
        </div>

        {/* 7 Tab Navigation Bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px scrollbar-none text-xs font-bold">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 border-b-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#075EE8] text-[#075EE8] bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#075EE8]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#075EE8] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                  <Gauge className="w-4 h-4 text-[#075EE8]" /> Odometer
                </div>
                <p className="text-base font-bold text-[#0A1E42]">{vehicle.mileage || '18,500 mi'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Daily Rate
                </div>
                <p className="text-base font-bold text-[#0A1E42]">{formatCurrency(vehicle.dailyRate || 65)}/day</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                  <User className="w-4 h-4 text-purple-600" /> Current Driver
                </div>
                <p className="text-sm font-bold text-[#0A1E42] truncate">{vehicle.driver || 'Unassigned'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                  <Shield className="w-4 h-4 text-indigo-600" /> Telematics
                </div>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Online
                </p>
              </div>
            </div>

            {/* Two Column Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Identification & Mechanical Specs */}
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <Car className="w-4 h-4 text-[#075EE8]" /> Technical Specifications
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Unique Fleet ID:</span>
                    <span className="font-mono font-bold text-[#0A1E42]">{vehicle.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">VIN Number:</span>
                    <span className="font-mono font-semibold text-slate-700">{vehicle.vin || '4T1B11HK5JU192831'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">License Plate:</span>
                    <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {vehicle.plate}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Fuel &amp; Transmission:</span>
                    <span className="font-medium text-slate-800">
                      {vehicle.fuel || 'Gasoline'} • {vehicle.transmission || 'Automatic'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Body Type / Category:</span>
                    <span className="font-medium text-slate-800">{vehicle.type || 'Sedan'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Operational Depot Hub:</span>
                    <span className="font-medium text-slate-800">{vehicle.depotLocation || vehicle.location || 'JFK Airport Fleet Hub'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Acquisition & Financing */}
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Acquisition &amp; Financing
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Purchase Date:</span>
                    <span className="font-medium text-slate-800">{vehicle.purchaseDate || '2024-01-15'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Purchase Price:</span>
                    <span className="font-bold text-[#0A1E42]">{formatCurrency(vehicle.purchasePrice || 28500)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Financing Structure:</span>
                    <span className="font-medium text-slate-800">{vehicle.financingType || 'Financed (Bank Loan)'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Lender / Institution:</span>
                    <span className="font-medium text-slate-800">{vehicle.lenderName || 'Chase Commercial Fleet Financing'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Loan Amount:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(vehicle.loanAmount || 24000)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Monthly Debt Service:</span>
                    <span className="font-bold text-emerald-700">
                      ${vehicle.monthlyPayment || 460}/mo ({vehicle.loanTermMonths || 48} mo term)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Dates Alert Box */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#075EE8] shrink-0" />
                <div>
                  <p className="font-bold text-[#0A1E42]">Compliance &amp; Insurance Expiration Tracking</p>
                  <p className="text-slate-500 text-[11px]">
                    Insurance Policy #TRV-8821: <strong className="text-slate-800">{vehicle.insuranceExpiry || '2025-11-30'}</strong> • DMV Reg: <strong className="text-slate-800">{vehicle.registrationExpiry || '2025-10-31'}</strong>
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] shrink-0">
                ✓ Regulatory Compliant
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: RENTAL HISTORY */}
        {activeTab === 'rentals' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0A1E42]">Leasing &amp; Rental Contracts History</h3>
                <p className="text-xs text-slate-400">All historical customer rental agreements for this vehicle</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Total Revenue: {formatCurrency(rentals.reduce((sum, r) => sum + r.totalAmount, 0))}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-2.5 px-3">Contract ID</th>
                    <th className="py-2.5 px-3">Customer / Driver</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Lease Type</th>
                    <th className="py-2.5 px-3 text-right">Daily Rate</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                    <th className="py-2.5 px-3 text-center">Payment</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{rental.id}</td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-[#0A1E42]">{rental.customer}</p>
                        <p className="text-[10px] text-slate-400">{rental.customerPhone}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        {rental.startDate} – {rental.endDate}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{rental.rentalType}</td>
                      <td className="py-2.5 px-3 text-right font-semibold">${rental.dailyRate}/d</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#0A1E42]">
                        {formatCurrency(rental.totalAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {rental.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rental.status === 'Active'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DRIVER ASSIGNMENT HISTORY (Read-only; Reassigning never overwrites old records) */}
        {activeTab === 'drivers' && (
          <div className="space-y-4 animate-fade-in">
            {/* Required Audit Notice */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Immutable Driver Assignment Audit Trail</p>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  This log is strictly <strong>read-only</strong>. When a vehicle is reassigned to a new driver, PrimeRoute automatically creates a new chronological handover entry without ever overwriting or altering previous driver records.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-2.5 px-3">Driver Name</th>
                    <th className="py-2.5 px-3">Assignment Period</th>
                    <th className="py-2.5 px-3">Handover Odometer</th>
                    <th className="py-2.5 px-3">Return Odometer</th>
                    <th className="py-2.5 px-3">Inspection / Handover Notes</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {driverHistory.map((item) => (
                    <tr
                      key={item.id}
                      className={item.isCurrent ? 'bg-blue-50/30 font-medium' : 'hover:bg-slate-50/80'}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0A1E42]">{item.driver}</span>
                          {item.isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#075EE8] text-white">
                              CURRENT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">{item.period}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                        {item.handoverOdometer}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                        {item.returnOdometer}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                        {item.condition}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isCurrent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0A1E42]">Vehicle Workshop &amp; Maintenance Logs</h3>
                <p className="text-xs text-slate-400">Scheduled servicing, safety checks, and repair invoices</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                Total Maintenance: {formatCurrency(maintenanceRecords.reduce((sum, m) => sum + m.cost, 0))}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-2.5 px-3">Service ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Service Scope &amp; Details</th>
                    <th className="py-2.5 px-3">Service Provider</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Odometer</th>
                    <th className="py-2.5 px-3 text-right">Cost</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {maintenanceRecords.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#075EE8]">{m.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">{m.category}</td>
                      <td className="py-2.5 px-3 max-w-xs text-slate-600 truncate">{m.type}</td>
                      <td className="py-2.5 px-3 text-slate-600">{m.provider}</td>
                      <td className="py-2.5 px-3">{m.serviceDate}</td>
                      <td className="py-2.5 px-3 font-mono">{m.mileage}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#0A1E42]">{formatCurrency(m.cost)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS (All 9 Categories) */}
        {activeTab === 'documents' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0A1E42]">Mandatory Compliance &amp; Asset Documents</h3>
                <p className="text-xs text-slate-400">
                  Title, registration, insurance, purchase/finance, inspections, maintenance, accidents, warranty &amp; sale
                </p>
              </div>
              <span className="text-xs font-bold text-[#075EE8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {documents.length} / 9 Document Types On File
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs hover:border-[#075EE8] hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${doc.badgeColor}`}>
                        {doc.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {doc.status}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-[#0A1E42] leading-snug line-clamp-2">
                      {doc.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <div>
                      <span>Expires: </span>
                      <span className="font-semibold text-slate-700">{doc.expiryDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveDocPreview(doc)}
                        className="p-1 text-slate-400 hover:text-[#075EE8] rounded transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${doc.title} (${doc.fileSize})...`)}
                        className="p-1 text-slate-400 hover:text-[#075EE8] rounded transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Preview Lightbox Modal */}
            {activeDocPreview && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scale-up">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm text-[#0A1E42]">{activeDocPreview.title}</h4>
                    <button
                      type="button"
                      onClick={() => setActiveDocPreview(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-slate-50 border rounded-xl p-4 text-center space-y-2">
                    <FileText className="w-12 h-12 text-[#075EE8] mx-auto opacity-80" />
                    <p className="font-bold text-xs text-[#0A1E42]">Verified Fleet Document Archive</p>
                    <p className="text-[11px] text-slate-500">{activeDocPreview.description}</p>
                    <div className="text-[10px] text-slate-400 pt-2 border-t">
                      Format: {activeDocPreview.fileSize} • Issued: {activeDocPreview.issueDate}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveDocPreview(null)}
                      className="px-3 py-1.5 border rounded-lg text-xs font-semibold"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert(`Downloading ${activeDocPreview.title}...`);
                        setActiveDocPreview(null);
                      }}
                      className="px-4 py-1.5 bg-[#075EE8] text-white rounded-lg text-xs font-semibold"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0A1E42]">Operating Expenses &amp; Direct Disbursements</h3>
                <p className="text-xs text-slate-400">Fuel, insurance, maintenance, tolls, detailing, and telematics</p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Total Expenses: {formatCurrency(expensesData.totalExpenses)}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Vendor / Payee</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {expensesData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500">{item.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#0A1E42]">{item.category}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.vendor}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{item.paymentMethod}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: PROFITABILITY */}
        {activeTab === 'profitability' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top 3 Required Highlight Figures with Tooltips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 1. Cash Flow */}
              <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm relative group hover:border-[#075EE8] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#075EE8] uppercase tracking-wider">
                    1. Cash Flow
                  </span>
                  <div className="relative group/tip cursor-help">
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-[#075EE8]" />
                    <div className="absolute right-0 bottom-6 hidden group-hover/tip:block z-30 w-64 p-2.5 bg-[#071D49] text-white text-[11px] rounded-xl shadow-xl leading-relaxed">
                      <strong>Net Cash Generated:</strong> Actual cash revenue collected minus actual cash expenses paid and debt installments (excludes non-cash depreciation).
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-[#0A1E42]">
                  {formatCurrency(profitability.cashFlowMtd)}
                  <span className="text-xs font-semibold text-slate-400 ml-1">MTD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Lifetime Net Cash: <strong className="text-emerald-700">{formatCurrency(profitability.cashFlowLifetime)}</strong>
                </p>
              </div>

              {/* 2. Operating Profit */}
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm relative group hover:border-emerald-500 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    2. Operating Profit
                  </span>
                  <div className="relative group/tip cursor-help">
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                    <div className="absolute right-0 bottom-6 hidden group-hover/tip:block z-30 w-64 p-2.5 bg-[#071D49] text-white text-[11px] rounded-xl shadow-xl leading-relaxed">
                      <strong>Fleet Operational Efficiency:</strong> Vehicle revenue minus direct operational operating expenses, maintenance, repairs, and fleet insurance (before financing interest and depreciation).
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {formatCurrency(profitability.operatingProfitMtd)}
                  <span className="text-xs font-semibold text-slate-400 ml-1">MTD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Lifetime Op Profit: <strong className="text-emerald-800">{formatCurrency(profitability.operatingProfitLifetime)}</strong>
                </p>
              </div>

              {/* 3. Accounting Profit */}
              <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm relative group hover:border-purple-600 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    3. Accounting Profit
                  </span>
                  <div className="relative group/tip cursor-help">
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                    <div className="absolute right-0 bottom-6 hidden group-hover/tip:block z-30 w-64 p-2.5 bg-[#071D49] text-white text-[11px] rounded-xl shadow-xl leading-relaxed">
                      <strong>Net GAAP Profit:</strong> Comprehensive vehicle net profit following GAAP/tax accounting, after deducting operating costs, maintenance, insurance, loan financing interest, and annualized vehicle depreciation.
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-700">
                  {formatCurrency(profitability.accountingProfitMtd)}
                  <span className="text-xs font-semibold text-slate-400 ml-1">MTD</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Lifetime Net GAAP: <strong className="text-purple-900">{formatCurrency(profitability.accountingProfitLifetime)}</strong>
                </p>
              </div>
            </div>

            {/* Mandatory Accountant Note Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="font-semibold">
                Note: <span className="underline font-bold">Confirm accounting rules with PrimeRoute's accountant</span> prior to formal fiscal year-end tax capitalization and statutory filing.
              </p>
            </div>

            {/* Financial Ledger & Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cost & Revenue Breakdown */}
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] pb-1.5 border-b border-slate-100">
                  Comprehensive P&amp;L Ledger Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-semibold text-slate-700">Total Vehicle Revenue:</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(profitability.revenueMtd)} (Lifetime: {formatCurrency(profitability.revenueLifetime)})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Operating Expenses (Fuel/Telematics):</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(profitability.operatingExpensesMtd)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Commercial Insurance Allocation:</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(profitability.insuranceCostMtd)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Scheduled Maintenance:</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(profitability.maintenanceCostMtd)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Repairs (Unscheduled):</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(profitability.repairsCostMtd)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Financing Interest Cost:</span>
                    <span className="font-semibold text-slate-700">-{formatCurrency(profitability.financingCostMtd)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Straight-Line Depreciation:</span>
                    <span className="font-semibold text-slate-700">-{formatCurrency(profitability.depreciationCostMtd)}</span>
                  </div>
                </div>
              </div>

              {/* Operational Efficiency & Daily Unit Economics */}
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A1E42] pb-1.5 border-b border-slate-100">
                  Fleet Utilization &amp; Unit Economics
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Active Rental Days:</span>
                    <span className="font-bold text-[#0A1E42]">{profitability.rentalDaysMtd} Days MTD ({profitability.rentalDaysLifetime} Lifetime)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Vehicle Downtime:</span>
                    <span className="font-bold text-amber-700">{profitability.downtimeDaysMtd} Days MTD ({profitability.downtimeDaysLifetime} Lifetime)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Revenue Per Rental Day:</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(profitability.revenuePerRentalDay)} / Day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">All-in Cost Per Rental Day:</span>
                    <span className="font-bold text-slate-700">{formatCurrency(profitability.costPerRentalDay)} / Day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Lifetime Fleet Utilization:</span>
                    <span className="font-bold text-[#075EE8]">{profitability.utilizationRate}% Service Ratio</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Capital Return on Investment (ROI):</span>
                    <span className="font-bold text-emerald-600">{profitability.roi}% Lifetime ROI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
