import React, { useState, useEffect } from 'react';
import { Archive, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';

const ARCHIVE_REASONS = [
  'Sold to third party',
  'Total loss / insurance settlement',
  'Lease return to finance company',
  'Decommissioned due to age / high mileage',
  'Transferred to another fleet entity',
  'Other decommission reason',
];

export default function ArchiveVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onConfirmArchive,
}) {
  const [reason, setReason] = useState(ARCHIVE_REASONS[0]);
  const [archiveDate, setArchiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [salvageValue, setSalvageValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(ARCHIVE_REASONS[0]);
      setArchiveDate(new Date().toISOString().split('T')[0]);
      setSalvageValue('');
      setNotes('');
      setError('');
    }
  }, [isOpen, vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a valid archive reason.');
      return;
    }

    onConfirmArchive({
      vehicleId: vehicle.id,
      archiveReason: reason,
      archiveDate,
      salvageValue: salvageValue ? Number(salvageValue) : null,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Archive Vehicle from Active Fleet"
      subtitle={`Archive ${vehicle.name} (${vehicle.plate}) • VIN: ${vehicle.vin || 'N/A'}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compliance Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Permanent Historical Preservation Policy</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              PrimeRoute does not permanently delete fleet assets. Archiving transitions this vehicle’s status to{' '}
              <strong className="font-bold underline">Sold/Retired</strong>. All past contracts, maintenance invoices, driver logs, and tax records will remain permanently accessible in reports.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <FormSelect
            label="Reason for Archival"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={ARCHIVE_REASONS}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Effective Archive Date"
              type="date"
              value={archiveDate}
              onChange={(e) => setArchiveDate(e.target.value)}
              required
            />
            <FormInput
              label="Realized Sale / Salvage Value ($)"
              type="number"
              placeholder="e.g. 14500 (optional)"
              value={salvageValue}
              onChange={(e) => setSalvageValue(e.target.value)}
            />
          </div>

          <FormTextarea
            label="Archival Documentation / Notes"
            placeholder="e.g. Sold to wholesale buyer following 60,000 mi lease retirement. Release paperwork archived in documents."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            Archive Vehicle
          </button>
        </div>
      </form>
    </Modal>
  );
}

