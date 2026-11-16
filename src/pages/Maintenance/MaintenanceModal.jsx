import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building2,
  Clock,
  Gauge
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useFleet } from '../../context/FleetContext';
import { initialSettings } from '../../data/mockData';

const SERVICE_TYPES = [
  'Oil Change - 5,000 miles',
  'Synthetic Oil & Filter (0W-20)',
  'Brake Service & Pad Replacement',
  'Tire Rotation & High-Speed Balancing',
  'Transmission Flush & Checkup',
  'Multi-Point Safety Inspection',
  'Battery & Alternator Diagnostic',
  'A/C Evaporator & Refrigerant Recharge',
  'Suspension & Strut Assembly Replacement',
  'Engine Tune-up & Spark Plugs'
];

const SERVICE_PROVIDERS = [
  'QuickLube Express Center',
  'Speedy Pro Auto Clinic',
  'Chevy Certified Service Hub',
  'Goodyear Commercial Fleet Hub',
  'Metro Ford Fleet Works',
  'Tesla Authorized Service Center',
  'Bimmer Motors VIP Workshop'
];

export default function MaintenanceModal({
  isOpen,
  onClose,
  onSave,
  record = null
}) {
  const { vehicles = [] } = useFleet();
  const isEditing = !!record;

  // Requirement 5: Default oil change interval 5,000 miles (configurable value read from settings)
  const defaultOilChangeInterval =
    initialSettings?.maintenanceIntervals?.oilChangeMiles || 5000;

  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicle: 'Toyota Camry SE (PR-2024-TC)',
    plate: 'PR-2024-TC',
    serviceDate: new Date().toISOString().split('T')[0],
    odometer: 24500,
    type: 'Oil Change - 5,000 miles',
    provider: 'QuickLube Express Center',
    cost: 85,
    invoiceUpload: null,
    invoiceFileName: '',
    invoiceFileSize: '',
    nextServiceMileage: 29500,
    nextServiceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Scheduled',
    notes: 'Includes multi-point fluid top-off and tire pressure check.'
  });

  const [invoicePreview, setInvoicePreview] = useState(null);

  useEffect(() => {
    if (record && isOpen) {
      const cleanOdo = record.odometer
        ? Number(String(record.odometer).replace(/[^0-9]/g, ''))
        : record.mileage
        ? Number(String(record.mileage).replace(/[^0-9]/g, ''))
        : 25000;

      const cleanNextOdo = record.nextServiceMileage
        ? Number(String(record.nextServiceMileage).replace(/[^0-9]/g, ''))
        : cleanOdo + defaultOilChangeInterval;

      setFormData({
        ...record,
        odometer: cleanOdo,
        nextServiceMileage: cleanNextOdo,
        nextServiceDate: record.nextServiceDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invoiceFileName: record.invoiceFileName || (record.invoiceUpload ? 'mechanic_invoice.pdf' : ''),
        status: record.status || 'Scheduled'
      });
      setInvoicePreview(record.invoiceUpload || null);
    } else if (isOpen) {
      const firstVeh = vehicles[0];
      const odo = firstVeh?.mileage
        ? Number(String(firstVeh.mileage).replace(/[^0-9]/g, ''))
        : 24500;

      setFormData({
        vehicleId: firstVeh?.id || 'VEH-001',
        vehicle: firstVeh
          ? `${firstVeh.make} ${firstVeh.model} (${firstVeh.plate || firstVeh.id})`
          : 'Toyota Camry SE (PR-2024-TC)',
        plate: firstVeh?.plate || 'PR-2024-TC',
        serviceDate: new Date().toISOString().split('T')[0],
        odometer: odo,
        type: 'Oil Change - 5,000 miles',
        provider: 'QuickLube Express Center',
        cost: 85,
        invoiceUpload: null,
        invoiceFileName: '',
        invoiceFileSize: '',
        nextServiceMileage: odo + defaultOilChangeInterval,
        nextServiceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Scheduled',
        notes: 'Includes multi-point fluid top-off and tire pressure check.'
      });
      setInvoicePreview(null);
    }
  }, [record, isOpen, vehicles, defaultOilChangeInterval]);

  // When vehicle changes, update plate & odometer
  const handleVehicleChange = (selectedVehStr) => {
    const selected = vehicles.find(
      (v) =>
        `${v.make} ${v.model} (${v.plate || v.id})` === selectedVehStr ||
        v.id === selectedVehStr ||
        v.plate === selectedVehStr
    );

    const odo = selected?.mileage
      ? Number(String(selected.mileage).replace(/[^0-9]/g, ''))
      : formData.odometer || 25000;

    setFormData((prev) => ({
      ...prev,
      vehicleId: selected?.id || prev.vehicleId,
      vehicle: selectedVehStr,
      plate: selected?.plate || prev.plate,
      odometer: odo,
      nextServiceMileage: odo + defaultOilChangeInterval
    }));
  };

  // Requirement 5: When odometer changes, automatically update next service mileage by interval
  const handleOdometerChange = (val) => {
    const odo = Number(val) || 0;
    setFormData((prev) => ({
      ...prev,
      odometer: odo,
      nextServiceMileage: odo + defaultOilChangeInterval
    }));
  };

  // File upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        invoiceFileName: file.name,
        invoiceFileSize: `${(file.size / 1024).toFixed(1)} KB`,
        invoiceUpload: file.name
      }));
      setInvoicePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveInvoice = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceFileName: '',
      invoiceFileSize: '',
      invoiceUpload: null
    }));
    setInvoicePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicle || !formData.type || !formData.provider) return;

    const newRecord = {
      ...formData,
      id: formData.id || `MNT-${Math.floor(100 + Math.random() * 900)}`,
      cost: Number(formData.cost) || 0,
      odometer: Number(formData.odometer) || 0,
      nextServiceMileage: Number(formData.nextServiceMileage) || (Number(formData.odometer) + defaultOilChangeInterval),
      mileage: `${Number(formData.odometer).toLocaleString()} mi`
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Maintenance Job: ${record?.id}` : 'Schedule Vehicle Fleet Maintenance'}
      subtitle={`Configure service task, garage provider, odometer intervals (${defaultOilChangeInterval.toLocaleString()} mi standard), and invoice voucher`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Vehicle & Service Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Fleet Vehicle <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.vehicle}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.make} ${v.model} (${v.plate || v.id})`}>
                  {v.year} {v.make} {v.model} ({v.plate || v.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.serviceDate}
              onChange={(e) => {
                const sDate = e.target.value;
                const nextDate = new Date(new Date(sDate).getTime() + 90 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0];
                setFormData({
                  ...formData,
                  serviceDate: sDate,
                  nextServiceDate: nextDate
                });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-medium"
              required
            />
          </div>
        </div>

        {/* Row 2: Service Type & Workshop Provider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Type <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="service-types"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g. Oil Change - 5,000 miles"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            />
            <datalist id="service-types">
              {SERVICE_TYPES.map((st) => (
                <option key={st} value={st} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Provider / Workshop <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="service-providers"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="e.g. Speedy Pro Auto Clinic"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-medium"
              required
            />
            <datalist id="service-providers">
              {SERVICE_PROVIDERS.map((sp) => (
                <option key={sp} value={sp} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Row 3: Odometer & Cost & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Odometer (Miles) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.odometer}
                onChange={(e) => handleOdometerChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-[#0A1E42]"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">mi</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Cost ($ USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-mono font-bold text-[#0A1E42]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8] font-bold text-[#0A1E42]"
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress (In Workshop)</option>
              <option value="Completed">Completed / Passed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Row 4: Next Service Mileage & Next Service Date (Requirement 4 & 5) */}
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#075EE8] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Next Maintenance Milestone (+{defaultOilChangeInterval.toLocaleString()} mi interval)
            </span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded">
              Configured in Settings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Next Service Mileage Due
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.nextServiceMileage}
                  onChange={(e) => setFormData({ ...formData, nextServiceMileage: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-bold text-[#071D49]"
                  required
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">mi</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Next Service Target Date
              </label>
              <input
                type="date"
                value={formData.nextServiceDate}
                onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono font-medium text-slate-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 5: Invoice Voucher Upload (Requirement 4) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Mechanic Invoice / Diagnostic Report Upload</span>
            <span className="text-[10px] text-slate-400 font-normal">PDF, JPG, PNG (up to 10MB)</span>
          </label>

          {formData.invoiceFileName ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#075EE8]" />
                <div>
                  <p className="font-bold text-[#071D49]">{formData.invoiceFileName}</p>
                  <p className="text-[10px] text-slate-500">{formData.invoiceFileSize || 'Attached Service Voucher'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveInvoice}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-[#075EE8] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Click to upload workshop invoice or work order</p>
              <p className="text-[10px] text-slate-400">Attach itemized parts &amp; labor receipt</p>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Row 6: Technician Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Technician Notes &amp; Replaced Parts
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Document OEM filter part numbers, brake pad thickness (mm), tire tread depths, fluid grades..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Update Service Record' : 'Schedule Maintenance'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
