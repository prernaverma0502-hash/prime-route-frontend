import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  KeyRound,
  X,
  Lock,
  Sparkles
} from 'lucide-react';
import Modal from '../common/Modal';
import DigitalSignaturePad from './DigitalSignaturePad';
import RentalAgreementDocument from './RentalAgreementDocument';
import { useFleet } from '../../context/FleetContext';
import { formatDate } from '../../utils/formatters';

export default function RentalAgreementModal({
  isOpen,
  onClose,
  rental,
  onAgreementSigned
}) {
  const { resolveVehicle, resolveDriver, updateRental, setRentals } = useFleet();

  const isAlreadySigned = rental?.agreementStatus === 'Signed';

  // Resolved entities
  const resolvedVehicle = useMemo(() => {
    return rental ? resolveVehicle(rental) : null;
  }, [rental, resolveVehicle]);

  const resolvedDriver = useMemo(() => {
    return rental ? resolveDriver(rental) : null;
  }, [rental, resolveDriver]);

  // Construct initial agreement data
  const baseAgreementData = useMemo(() => {
    if (!rental) return null;

    // If agreementData snapshot already exists, use it to ensure immutability
    if (rental.agreementData) {
      return rental.agreementData;
    }

    // Otherwise construct fresh data snapshot
    const dName = resolvedDriver?.name || rental.driver || rental.customer || 'Driver Name';
    const dLicense = resolvedDriver?.license || 'DL-PENDING';
    const dPhone = resolvedDriver?.phone || rental.customerPhone || '';
    const dEmail = resolvedDriver?.email || rental.customerEmail || '';

    const vYear = resolvedVehicle?.year || 2024;
    const vMake = resolvedVehicle?.make || 'Toyota';
    const vModel = resolvedVehicle?.model || 'Camry';
    const vColor = resolvedVehicle?.color || 'Black';
    const vVin = resolvedVehicle?.vin || 'VIN-PENDING-CHECK';
    const vPlate = resolvedVehicle?.plate || 'PR-2024-TC';

    return {
      agreementId: rental.agreementId || `AGR-${rental.id}`,
      owner: 'PrimeRoute Fleet Operations',
      representativeName: 'John Doe (Administrator)',
      driverName: dName,
      driverLicense: dLicense,
      driverPhone: dPhone,
      driverEmail: dEmail,
      vehicleYear: vYear,
      vehicleMake: vMake,
      vehicleModel: vModel,
      vehicleColor: vColor,
      vehicleVin: vVin,
      vehiclePlate: vPlate,
      pickupOdometer: rental.pickupOdometer ?? (resolvedVehicle?.mileage || 24500),
      pickupFuelLevel: rental.pickupFuelLevel || 'Full (100%)',
      startDate: rental.startDate,
      endDate: rental.endDate,
      weeklyRent: rental.weeklyRent || Math.round((rental.amount || 1950) / 4),
      paymentDueDay: rental.paymentDueDay || 'Every Monday',
      securityDeposit: rental.securityDeposit || rental.deposit || 300,
    };
  }, [rental, resolvedDriver, resolvedVehicle]);

  // Signatures state
  const [driverSignature, setDriverSignature] = useState(null);
  const [representativeSignature, setRepresentativeSignature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Synchronize on modal open or rental change
  useEffect(() => {
    if (rental) {
      setDriverSignature(rental.driverSignature || null);
      setRepresentativeSignature(rental.representativeSignature || null);
      setValidationError('');
    }
  }, [rental, isOpen]);

  if (!isOpen || !rental) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    // Generate text/markdown export of the agreement record
    const data = baseAgreementData;
    const content = `=====================================================
PRIME ROUTE VEHICLE RENTAL AGREEMENT
Agreement ID: ${data.agreementId}
Status: ${rental.agreementStatus || 'Active'}
=====================================================

1. PARTIES
Owner: ${data.owner}
Representative: ${data.representativeName}
Driver (Renter): ${data.driverName}
DL#: ${data.driverLicense}
Phone: ${data.driverPhone}
Email: ${data.driverEmail}

2. VEHICLE SPECIFICATIONS
Year/Make/Model: ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}
Color: ${data.vehicleColor}
VIN: ${data.vehicleVin}
License Plate: ${data.vehiclePlate}
Pickup Handover Odometer: ${data.pickupOdometer} mi
Pickup Fuel Level: ${data.pickupFuelLevel}

3. FINANCIAL TERMS
Rental Start Date: ${data.startDate}
Weekly Rent: $${data.weeklyRent}
Payment Due: ${data.paymentDueDay}
Refundable Security Deposit: $${data.securityDeposit}

4. LEGAL EXECUTION
Signed At: ${rental.signedAt || new Date().toISOString()}
PrimeRoute Representative: Digitally Signed (${data.representativeName})
Driver: Digitally Signed (${data.driverName})
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PrimeRoute_Agreement_${rental.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmSignatures = () => {
    if (!driverSignature) {
      setValidationError('Driver signature is required to execute this legal agreement.');
      return;
    }
    if (!representativeSignature) {
      setValidationError('PrimeRoute Representative signature is required.');
      return;
    }

    setIsSubmitting(true);

    const nowISO = new Date().toISOString();
    const finalizedAgreementData = {
      ...baseAgreementData,
      driverSignature,
      representativeSignature,
      signedAt: nowISO,
      status: 'Signed'
    };

    const updatedRental = {
      ...rental,
      agreementStatus: 'Signed',
      signedAt: nowISO,
      agreementId: baseAgreementData.agreementId,
      driverSignature,
      representativeSignature,
      agreementData: finalizedAgreementData
    };

    // Update shared context
    setRentals((prev) =>
      prev.map((r) => (r.id === rental.id ? updatedRental : r))
    );

    if (onAgreementSigned) {
      onAgreementSigned(updatedRental);
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rental Agreement: ${rental.id}`}
      subtitle={`Official Vehicle Lease Document • Customer: ${rental.customer} • Agreement ID: ${rental.agreementId || baseAgreementData?.agreementId}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Operational Status Banner */}
        <div
          className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-sm ${
            isAlreadySigned
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-blue-50/80 border-blue-200 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isAlreadySigned ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {isAlreadySigned ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold">
                  {isAlreadySigned
                    ? 'Digitally Executed & Sealed Agreement'
                    : 'Awaiting Digital Signature Review'}
                </h4>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    isAlreadySigned
                      ? 'bg-emerald-200/70 text-emerald-800'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isAlreadySigned ? 'Signed & Enforced' : 'Pending Signature'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isAlreadySigned
                  ? `Executed on ${rental.signedAt ? formatDate(rental.signedAt) : 'Handover Date'}. Bound to ${rental.driver} for ${rental.vehicle}.`
                  : 'Review all verbatim contract terms below and complete digital signatures to formally execute.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#075EE8]" /> Print / Save as PDF
            </button>
            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071D49] text-white text-xs font-bold hover:bg-[#0D2D6C] transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Summary
            </button>
          </div>
        </div>

        {/* Digital Signature Pads (Visible if Pending Signature) */}
        {!isAlreadySigned && (
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 no-print animate-slide-up">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071D49] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#075EE8]" /> Step 1: Capture Dual Digital Signatures
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Both the Driver and PrimeRoute Authorized Representative must adopt or draw their signature before sealing.
              </p>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DigitalSignaturePad
                title="PrimeRoute Representative Signature"
                signerName={baseAgreementData?.representativeName || 'John Doe (Administrator)'}
                role="Authorized Representative"
                initialSignature={representativeSignature}
                onSignatureChange={(sig) => {
                  setRepresentativeSignature(sig);
                  if (validationError) setValidationError('');
                }}
              />

              <DigitalSignaturePad
                title="Driver (Renter) Signature"
                signerName={baseAgreementData?.driverName || rental.driver}
                role="Renter"
                initialSignature={driverSignature}
                onSignatureChange={(sig) => {
                  setDriverSignature(sig);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                Signatures will be permanently stamped into the legal document snapshot below.
              </span>

              <button
                type="button"
                disabled={!driverSignature || !representativeSignature || isSubmitting}
                onClick={handleConfirmSignatures}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  driverSignature && representativeSignature && !isSubmitting
                    ? 'bg-[#075EE8] text-white hover:bg-[#0650C7] cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Sealing Agreement...' : 'Confirm & Seal Agreement'}
              </button>
            </div>
          </div>
        )}

        {/* Verbatim Document Preview (Clean Scrollable Container) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 p-2 sm:p-4">
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain rounded-xl shadow-inner">
            <RentalAgreementDocument
              agreementData={baseAgreementData}
              driverSignature={driverSignature}
              representativeSignature={representativeSignature}
              signedAt={rental.signedAt}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 no-print">
          <div className="text-xs text-slate-500">
            Agreement ID: <span className="font-mono font-bold text-[#0A1E42]">{baseAgreementData?.agreementId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

