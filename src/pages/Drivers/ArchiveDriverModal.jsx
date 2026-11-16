import React, { useState, useEffect } from 'react';
import { Archive, AlertTriangle, ShieldCheck, UserX } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormInputs';

const ARCHIVE_REASONS = [
  'Contract terminated',
  'Driver resigned / Left company',
  'CDL License expired / revoked',
  'Mutual departure agreement',
  'Disciplinary termination',
  'Medical / Long-term leave',
  'Other departure reason',
];

export default function ArchiveDriverModal({
  isOpen,
  onClose,
  driver,
  onConfirmArchive,
}) {
  const [reason, setReason] = useState(ARCHIVE_REASONS[0]);
  const [archiveDate, setArchiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [unassignVehicle, setUnassignVehicle] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(ARCHIVE_REASONS[0]);
      setArchiveDate(new Date().toISOString().split('T')[0]);
      setUnassignVehicle(true);
      setNotes('');
      setError('');
    }
  }, [isOpen, driver]);

  if (!isOpen || !driver) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a valid archive reason.');
      return;
    }

    onConfirmArchive({
      driverId: driver.id,
      archiveReason: reason,
      archiveDate,
      unassignVehicle,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Archive Driver from Active Fleet Roster"
      subtitle={`Archive ${driver.name} (ID: ${driver.id}) • Vehicle: ${driver.vehicle || 'None'}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compliance Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Permanent Regulatory Preservation Policy</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Driver profiles are never permanently expunged. Archiving marks this driver’s status as{' '}
              <strong className="font-bold underline">Archived / Inactive</strong>. All historical lease agreements, payment ledgers, safety inspections, and background records are permanently preserved for regulatory and DMV compliance.
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
            label="Reason for Archival / Departure"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={ARCHIVE_REASONS}
            required
          />

          <FormInput
            label="Effective Archive Date"
            type="date"
            value={archiveDate}
            onChange={(e) => setArchiveDate(e.target.value)}
            required
          />

          {driver.vehicle && driver.vehicle !== 'Unassigned' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <input
                type="checkbox"
                id="unassignVehicle"
                checked={unassignVehicle}
                onChange={(e) => setUnassignVehicle(e.target.checked)}
                className="w-4 h-4 rounded text-[#075EE8] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="unassignVehicle" className="font-medium text-slate-700 cursor-pointer">
                Automatically unassign vehicle (<strong>{driver.vehicle}</strong>) and return it to Available fleet
              </label>
            </div>
          )}

          <FormTextarea
            label="Archival Documentation / Exit Remarks"
            placeholder="e.g. Completed exit handover. Key returned, final lease statement reconciled, deposit refund processed."
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
            Archive Driver
          </button>
        </div>
      </form>
    </Modal>
  );
}

