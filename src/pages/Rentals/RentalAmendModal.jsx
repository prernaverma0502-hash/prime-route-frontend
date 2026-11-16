import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  History,
  FileSignature,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { FormInput, FormTextarea } from '../../components/forms/FormInputs';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useFleet } from '../../context/FleetContext';

export default function RentalAmendModal({
  isOpen,
  onClose,
  rental,
  onSaved
}) {
  const { updateRental } = useFleet();

  const [newEndDate, setNewEndDate] = useState('');
  const [newWeeklyRent, setNewWeeklyRent] = useState('');
  const [newMileageAllowance, setNewMileageAllowance] = useState('');
  const [amendmentReason, setAmendmentReason] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('Primary Admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (rental && isOpen) {
      // Calculate a suggested 14-day extension from current end date
      let suggestedDate = rental.endDate;
      if (rental.endDate) {
        const d = new Date(rental.endDate);
        d.setDate(d.getDate() + 14);
        suggestedDate = d.toISOString().split('T')[0];
      }
      setNewEndDate(suggestedDate || '');
      setNewWeeklyRent(String(rental.weeklyRent || Math.round((rental.amount || 1950) / 4) || '450'));
      setNewMileageAllowance(String(rental.mileageAllowance || '1200'));
      setAmendmentReason('');
      setAuthorizedBy('Primary Admin (Authorized Officer)');
      setError('');
      setSuccess('');
    }
  }, [rental, isOpen]);

  if (!isOpen || !rental) return null;

  const currentWeeklyRate = rental.weeklyRent || Math.round((rental.amount || 1950) / 4) || 450;
  const currentMileage = rental.mileageAllowance || 1200;
  const amendmentHistory = rental.amendmentHistory || [];

  const handleApplyAmendment = (e) => {
    e.preventDefault();
    setError('');

    if (!newEndDate) {
      setError('Please provide a valid new End Date for the contract extension.');
      return;
    }

    if (newEndDate <= rental.startDate) {
      setError('New End Date must be after the contract Start Date.');
      return;
    }

    if (!amendmentReason.trim()) {
      setError('Please provide a business justification / reason for this amendment.');
      return;
    }

    const rentNumber = Number(newWeeklyRent);
    if (isNaN(rentNumber) || rentNumber <= 0) {
      setError('Please specify a valid weekly rate.');
      return;
    }

    // Determine what changed
    const changes = [];
    if (newEndDate !== rental.endDate) {
      changes.push({
        field: 'Contract End Date',
        oldVal: formatDate(rental.endDate),
        newVal: formatDate(newEndDate)
      });
    }

    if (rentNumber !== currentWeeklyRate) {
      changes.push({
        field: 'Weekly Rate',
        oldVal: formatCurrency(currentWeeklyRate),
        newVal: formatCurrency(rentNumber)
      });
    }

    const mileageNumber = Number(newMileageAllowance);
    if (!isNaN(mileageNumber) && mileageNumber !== currentMileage) {
      changes.push({
        field: 'Weekly Mileage Allowance',
        oldVal: `${currentMileage.toLocaleString()} mi/wk`,
        newVal: `${mileageNumber.toLocaleString()} mi/wk`
      });
    }

    if (changes.length === 0) {
      setError('No parameters were changed. Please modify at least one term to create an amendment.');
      return;
    }

    const newAmendmentRecord = {
      id: `AMD-${Date.now()}`,
      amendedAt: new Date().toISOString(),
      amendedBy: authorizedBy || 'Fleet Operations Officer',
      reason: amendmentReason.trim(),
      changes: changes
    };

    // Calculate updated total billing amount
    const oldWeeks = Math.max(1, Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (7 * 24 * 60 * 60 * 1000)));
    const newWeeks = Math.max(1, Math.ceil((new Date(newEndDate) - new Date(rental.startDate)) / (7 * 24 * 60 * 60 * 1000)));
    const updatedBaseAmount = rentNumber * newWeeks;
    const updatedTax = Math.round(updatedBaseAmount * 0.08);
    const updatedTotal = updatedBaseAmount + updatedTax;

    const updatedRental = {
      ...rental,
      endDate: newEndDate,
      weeklyRent: rentNumber,
      amount: updatedBaseAmount,
      total: updatedTotal,
      mileageAllowance: mileageNumber || currentMileage,
      status: rental.status === 'Completed' ? 'Completed' : 'Renewed',
      amendmentHistory: [newAmendmentRecord, ...amendmentHistory]
    };

    updateRental(rental.id, updatedRental);

    if (onSaved) {
      onSaved(updatedRental);
    }

    setSuccess('Amendment successfully recorded and contract terms updated!');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Extend & Amend Contract: ${rental.id}`}
      subtitle={`Customer: ${rental.customer || rental.driver} • Vehicle: ${rental.vehicle}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Banner Alert */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071D49] to-[#0D2D6C] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Lease Extension &amp; Rate Amendment Console</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Status: {rental.status}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Extend duration, revise rates, or modify mileage allowances while preserving full audit history.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleApplyAmendment} className="space-y-5">
          <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#075EE8]" /> Proposed Term Changes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Current End Date
                </label>
                <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-600">
                  {formatDate(rental.endDate)}
                </div>
              </div>

              <div className="sm:col-span-2">
                <FormInput
                  label="New Extended End Date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  required
                  helperText="Must be after original start date."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Weekly Lease Rate ($)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current: ${currentWeeklyRate} ➔</span>
                  <input
                    type="number"
                    value={newWeeklyRent}
                    onChange={(e) => setNewWeeklyRent(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#075EE8] font-bold text-[#0A1E42]"
                    placeholder="450"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mileage Allowance (Miles / Week)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current: {currentMileage} ➔</span>
                  <input
                    type="number"
                    value={newMileageAllowance}
                    onChange={(e) => setNewMileageAllowance(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#075EE8] font-bold text-[#0A1E42]"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
              <div className="sm:col-span-1">
                <FormInput
                  label="Authorized Administrator"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  placeholder="Officer name & title"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Amendment Reason / Commercial Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={amendmentReason}
                  onChange={(e) => setAmendmentReason(e.target.value)}
                  placeholder="e.g. Driver requested 2-week lease extension; corporate rate approved..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#075EE8] text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Change History Timeline Section */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-[#075EE8]" /> Amendment &amp; Extension History Timeline
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                {amendmentHistory.length} Recorded Amendment(s)
              </span>
            </div>

            {amendmentHistory.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Baseline Contract:</strong> Original lease executed on {formatDate(rental.startDate)} with no prior amendments.
                </span>
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {amendmentHistory.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    {/* Circle icon on line */}
                    <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#075EE8] ring-4 ring-blue-50" />

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono font-bold text-[#071D49]">
                          {item.id} • {formatDate(item.amendedAt)}
                        </span>
                        <span className="font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                          By: {item.amendedBy}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-800">
                        Reason: &quot;{item.reason}&quot;
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.changes?.map((ch, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] flex items-center gap-1.5 text-slate-700"
                          >
                            <span className="font-bold text-[#0A1E42]">{ch.field}:</span>
                            <span className="line-through text-slate-400">{ch.oldVal}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-600" />
                            <span className="font-bold text-emerald-700">{ch.newVal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <FileSignature className="w-4 h-4" /> Apply Extension / Amendment
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

