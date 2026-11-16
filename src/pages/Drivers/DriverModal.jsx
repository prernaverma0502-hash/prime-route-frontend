import React, { useState, useEffect } from 'react';
import { AlertCircle, User, Shield, Phone, Mail, MapPin, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';
import { useFleet } from '../../context/FleetContext';

const US_STATES = [
  'NY', 'NJ', 'CA', 'IL', 'TX', 'FL', 'PA', 'CT', 'MA', 'GA',
  'NC', 'OH', 'MI', 'VA', 'WA', 'AZ', 'CO', 'MD', 'NV', 'Other'
];

const DRIVER_STATUSES = ['Active', 'Inactive', 'Suspended', 'Pending Review'];

export default function DriverModal({
  isOpen,
  onClose,
  onSave,
  driver = null,
}) {
  const { drivers, vehicles } = useFleet();
  const isEditing = !!driver;

  const defaultForm = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '142 W 57th St, New York, NY 10019',
    license: '',
    licenseState: 'NY',
    licenseExpiry: '2026-09-14',
    status: 'Active',
    startDate: '2024-01-15',
    joiningDate: '2024-01-15',
    dob: '1990-05-14',
    emergencyContact: 'Rachel Vance (+1 555-901-2244)',
    vehicle: 'Unassigned',
    salaryRate: '$2,400/mo',
    balance: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    notes: '',
  };

  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driver) {
      setFormData({
        ...defaultForm,
        ...driver,
        startDate: driver.startDate || driver.joiningDate || '2024-01-15',
        joiningDate: driver.joiningDate || driver.startDate || '2024-01-15',
        licenseState: driver.licenseState || 'NY',
        licenseExpiry: driver.licenseExpiry || '2026-09-14',
        emergencyContact: driver.emergencyContact || 'Emergency Contact (+1 555-000-0000)',
      });
      setErrors({});
    } else if (isOpen) {
      // Auto-generate next driver ID
      const existingIds = (drivers || []).map((d) => d.id).filter(Boolean);
      let nextNum = 101;
      while (existingIds.includes(`DRV-${nextNum}`)) {
        nextNum++;
      }
      setFormData({
        ...defaultForm,
        id: `DRV-${nextNum}`,
        name: 'Jordan Miller',
        phone: '+1 (555) 345-6712',
        email: `driver${nextNum}@primeroute.fleet`,
        license: `DL-NY-84920${nextNum % 100}`,
      });
      setErrors({});
    }
  }, [driver, isOpen, drivers]);

  const handleAutoFillSample = () => {
    const existingIds = (drivers || []).map((d) => d.id).filter(Boolean);
    let nextNum = 101;
    while (existingIds.includes(`DRV-${nextNum}`)) {
      nextNum++;
    }
    setFormData({
      ...defaultForm,
      id: `DRV-${nextNum}`,
      name: 'Jordan Miller',
      phone: '+1 (555) 345-6712',
      email: `driver${nextNum}@primeroute.fleet`,
      address: '142 W 57th St, New York, NY 10019',
      license: `DL-NY-84920${nextNum % 100}`,
      licenseState: 'NY',
      licenseExpiry: '2026-09-14',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContact: 'Rachel Vance (+1 555-901-2244)',
      vehicle: 'Unassigned',
      salaryRate: '$2,400/mo',
      balance: 0,
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'startDate') {
        updated.joiningDate = value;
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // License expiry helper calculation for live badge
  const getLicenseExpiryStatus = (expiryDateStr) => {
    if (!expiryDateStr) return { status: 'unknown', text: 'No Date Set', color: 'bg-slate-100 text-slate-600' };
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'expired',
        text: `EXPIRED (${Math.abs(diffDays)}d ago)`,
        color: 'bg-rose-50 text-rose-700 border-rose-200'
      };
    }
    if (diffDays <= 30) {
      return {
        status: 'warning',
        text: `EXPIRING SOON (${diffDays} days left)`,
        color: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    }
    return {
      status: 'valid',
      text: 'VALID & ACTIVE',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  };

  const expiryBadge = getLicenseExpiryStatus(formData.licenseExpiry);

  const validate = () => {
    const newErrors = {};

    // 1. Driver ID
    if (!formData.id?.trim()) {
      newErrors.id = 'Driver ID is required.';
    } else {
      const idUpper = formData.id.trim().toUpperCase();
      const duplicateId = (drivers || []).find(
        (d) => d.id?.toUpperCase() === idUpper && d.id !== driver?.id
      );
      if (duplicateId) {
        newErrors.id = `Driver ID "${formData.id}" is already assigned to ${duplicateId.name}.`;
      }
    }

    // 2. Personal contact info
    if (!formData.name?.trim()) newErrors.name = 'Full name is required.';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.email?.trim()) newErrors.email = 'Email address is required.';
    if (!formData.address?.trim()) newErrors.address = 'Street address is required.';

    // 3. License info
    if (!formData.license?.trim()) newErrors.license = 'Driver license number is required.';
    if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiration date is required.';

    // 4. Emergency contact
    if (!formData.emergencyContact?.trim()) {
      newErrors.emergencyContact = 'Emergency contact name and phone number are required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      id: formData.id.trim().toUpperCase(),
      license: formData.license.trim().toUpperCase(),
      startDate: formData.startDate || formData.joiningDate,
      joiningDate: formData.startDate || formData.joiningDate,
      rating: formData.rating || 4.9,
      balance: Number(formData.balance) || 0,
    };

    onSave(payload);
    onClose();
  };

  // Compile vehicle options
  const vehicleOptions = [
    'Unassigned',
    ...Array.from(new Set((vehicles || []).map((v) => v.name || `${v.make} ${v.model} (${v.plate})`).filter(Boolean))),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Driver: ${driver.name}` : 'Register New Fleet Driver'}
      subtitle="Complete chauffeur profile, CDL license certification, compliance & vehicle assignment"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Validation Errors Header */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please correct the following fields before saving:</p>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-rose-700">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 1: Identification & Profile */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <User className="w-3.5 h-3.5 text-[#075EE8]" /> 1. Driver Profile &amp; Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <FormInput
                label="Unique Driver ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. DRV-101"
                required
              />
              {errors.id && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.id}</p>}
            </div>

            <div className="sm:col-span-2">
              <FormInput
                label="Driver Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Marcus Vance"
                required
              />
              {errors.name && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.name}</p>}
            </div>

            <div>
              <FormInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 234-8901"
                required
              />
              {errors.phone && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="marcus.vance@primeroute.io"
                required
              />
              {errors.email && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.email}</p>}
            </div>

            <div>
              <FormInput
                label="Date of Birth (DOB)"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormInput
                label="Start Date (Employment / Lease)"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <FormInput
              label="Residential Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 142 W 57th St, New York, NY 10019"
              required
            />
            {errors.address && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.address}</p>}
          </div>
        </div>

        {/* Section 2: CDL License & Compliance */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> 2. Commercial Driving License &amp; Compliance
            </h4>
            {/* Live Expiry Warning Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${expiryBadge.color}`}>
              {expiryBadge.status === 'expired' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
              {expiryBadge.status === 'warning' && <Clock className="w-3 h-3 text-amber-600" />}
              {expiryBadge.status === 'valid' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              {expiryBadge.text}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <FormInput
                label="Driver License Number"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="e.g. DL-NY-9028148"
                required
              />
              {errors.license && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.license}</p>}
            </div>

            <div>
              <FormSelect
                label="Issuing State"
                name="licenseState"
                value={formData.licenseState}
                onChange={handleChange}
                options={US_STATES}
                required
              />
            </div>

            <div>
              <FormInput
                label="License Expiration Date"
                name="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={handleChange}
                required
              />
              {errors.licenseExpiry && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.licenseExpiry}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Operational Assignment & Emergency Contact */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E42] flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <Clock className="w-3.5 h-3.5 text-purple-600" /> 3. Operational Assignment &amp; Emergency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <FormSelect
                label="Roster Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={DRIVER_STATUSES}
                required
              />
            </div>

            <div>
              <FormSelect
                label="Assigned Fleet Vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                options={vehicleOptions}
              />
            </div>

            <div>
              <FormInput
                label="Account Outstanding Balance ($)"
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <FormInput
              label="Emergency Contact (Name &amp; Phone)"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="e.g. Rachel Vance (+1 555-901-2244)"
              required
            />
            {errors.emergencyContact && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.emergencyContact}</p>
            )}
          </div>

          <FormTextarea
            label="Internal Driver Notes / Background Checks"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Completed annual commercial defensive driving course; certified for airport luxury pickup."
            rows={2}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          {!isEditing && (
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#075EE8] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer"
            >
              Auto-fill Sample Driver
            </button>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              {isEditing ? 'Save Driver Changes' : 'Register Driver'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
