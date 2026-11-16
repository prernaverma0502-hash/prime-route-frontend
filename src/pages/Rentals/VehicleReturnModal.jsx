import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  ClipboardCheck,
  Printer,
  AlertTriangle
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useFleet } from '../../context/FleetContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import ReturnMetricsComparison from './components/ReturnMetricsComparison';
import ReturnConditionChecklist from './components/ReturnConditionChecklist';

export default function VehicleReturnModal({
  isOpen,
  onClose,
  rental,
  onReturnCompleted,
  isViewOnly = false
}) {
  const { resolveVehicle, resolveDriver, updateVehicleStatus, updateDriverVehicle, updateRental, addInspection } = useFleet();

  const isCompleted = rental?.status === 'Completed' || isViewOnly;

  // Resolve Vehicle and Driver
  const vehicle = useMemo(() => {
    return rental ? resolveVehicle(rental) : null;
  }, [rental, resolveVehicle]);

  const driver = useMemo(() => {
    return rental ? resolveDriver(rental) : null;
  }, [rental, resolveDriver]);

  // Pickup baseline metrics
  const pickupOdometer = useMemo(() => {
    if (!rental) return 0;
    if (typeof rental.pickupOdometer === 'number') return rental.pickupOdometer;
    if (rental.agreementData?.pickupOdometer) return Number(rental.agreementData.pickupOdometer);
    const parsed = parseInt(String(rental.pickupOdometer || vehicle?.mileage || '0').replace(/\D/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [rental, vehicle]);

  const pickupFuel = rental?.pickupFuelLevel || rental?.agreementData?.pickupFuelLevel || 'Full (100%)';
  const pickupCondition = rental?.pickupCondition || 'Pristine / No visible damage';

  // Form State
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().slice(0, 5);

  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    returnDate: todayStr,
    returnTime: timeStr,
    returnOdometer: '',
    returnFuelLevel: 'Full (100%)',
    exteriorCondition: 'Clean / Pristine (No Dents)',
    interiorCondition: 'Clean & Sanitized',
    hasDamage: false,
    damageNotes: '',
    damageFee: '',
    remarks: 'Vehicle returned in clean operating condition. All keys and transponder accounted for.',
    keysReturned: true,
    vehicleClean: true,
    fuelChecked: true,
    belongingsRemoved: true,
    driverAcknowledged: true
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (rental && isOpen) {
      setPhotos(rental.returnPhotos || []);
      if (isCompleted) {
        const returnDateVal = rental.returnDateTime ? rental.returnDateTime.split('T')[0] : todayStr;
        const returnTimeVal = rental.returnDateTime ? rental.returnDateTime.split('T')[1]?.slice(0, 5) || '16:00' : '16:00';
        setFormData({
          returnDate: returnDateVal,
          returnTime: returnTimeVal,
          returnOdometer: String(rental.returnOdometer || pickupOdometer + 450),
          returnFuelLevel: rental.returnFuelLevel || 'Full (100%)',
          exteriorCondition: rental.returnCondition?.split('/')[0]?.trim() || 'Good condition',
          interiorCondition: rental.returnCondition?.split('/')[1]?.trim() || 'Clean',
          hasDamage: !!rental.hasDamage,
          damageNotes: rental.damageNotes || '',
          damageFee: String(rental.damageFee || ''),
          remarks: rental.returnRemarks || rental.notes || 'Vehicle returned and settled.',
          keysReturned: true,
          vehicleClean: true,
          fuelChecked: true,
          belongingsRemoved: true,
          driverAcknowledged: true
        });
      } else {
        setFormData({
          returnDate: todayStr,
          returnTime: timeStr,
          returnOdometer: String(pickupOdometer > 0 ? pickupOdometer + 350 : ''),
          returnFuelLevel: 'Full (100%)',
          exteriorCondition: 'Clean / Pristine (No Dents)',
          interiorCondition: 'Clean & Sanitized',
          hasDamage: false,
          damageNotes: '',
          damageFee: '',
          remarks: 'Vehicle returned in clean operating condition. All keys and transponder accounted for.',
          keysReturned: true,
          vehicleClean: true,
          fuelChecked: true,
          belongingsRemoved: true,
          driverAcknowledged: true
        });
      }
      setErrors({});
    }
  }, [rental, isOpen, isCompleted, pickupOdometer, todayStr, timeStr]);

  if (!isOpen || !rental) return null;

  const returnOdoNum = Number(formData.returnOdometer) || 0;
  const distanceTravelled = Math.max(0, returnOdoNum - pickupOdometer);
  const isOdometerInvalid = formData.returnOdometer !== '' && returnOdoNum < pickupOdometer;

  // Calculate settlement breakdown
  const depositHeld = rental.securityDeposit || rental.deposit || 500;
  const fuelShortfallFee =
    formData.returnFuelLevel && !formData.returnFuelLevel.includes('Full') && !formData.returnFuelLevel.includes('100%')
      ? 45
      : 0;

  const allowedMiles = (rental.mileageAllowance || 1200) * 2;
  const excessMiles = Math.max(0, distanceTravelled - allowedMiles);
  const excessMileageFee = excessMiles * (rental.excessMileageRate || 0.25);
  const damageDeduction = formData.hasDamage ? Number(formData.damageFee) || 0 : 0;
  const totalDeductions = fuelShortfallFee + excessMileageFee + damageDeduction;
  const netRefund = depositHeld - totalDeductions;

  const settlement = {
    depositHeld,
    fuelShortfallFee,
    excessMiles,
    excessMileageFee,
    damageDeduction,
    totalDeductions,
    netRefund
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required.';
    }

    if (!formData.returnOdometer || isNaN(returnOdoNum) || returnOdoNum < 0) {
      newErrors.returnOdometer = 'Valid return odometer reading is required.';
    } else if (returnOdoNum < pickupOdometer) {
      newErrors.returnOdometer = `Return odometer (${returnOdoNum.toLocaleString()} mi) cannot be less than departure odometer (${pickupOdometer.toLocaleString()} mi).`;
    }

    if (!formData.returnFuelLevel) {
      newErrors.returnFuelLevel = 'Return fuel level is required.';
    }

    if (formData.hasDamage && !formData.damageNotes.trim()) {
      newErrors.damageNotes = 'Please describe the observed damage or maintenance issue.';
    }

    if (!formData.keysReturned) {
      newErrors.keysReturned = 'All vehicle keys and transponder must be accounted for before completing return.';
    }

    if (!formData.driverAcknowledged) {
      newErrors.driverAcknowledged = 'Driver acknowledgment of return inspection and settlement is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const returnDateTimeISO = `${formData.returnDate}T${formData.returnTime || '12:00'}:00`;
    const combinedCondition = `${formData.exteriorCondition} • Interior: ${formData.interiorCondition}`;

    // 1. Determine vehicle status transition & update vehicle mileage
    const newVehicleStatus = formData.hasDamage ? 'Maintenance' : 'Available';
    const targetVehicleRef = rental.vehicleId || vehicle?.id || vehicle?.plate || rental.vehicle;
    if (targetVehicleRef) {
      updateVehicleStatus(targetVehicleRef, newVehicleStatus, 'Unassigned', returnOdoNum);
    }

    // 2. Clear driver vehicle assignment
    const targetDriverRef = rental.driverId || driver?.id || driver?.name || rental.driver;
    if (targetDriverRef) {
      updateDriverVehicle(targetDriverRef, 'Unassigned');
    }

    // 3. Create linked Inspection Record
    const inspectionId = `INS-${Date.now()}`;
    const newInspectionRecord = {
      id: inspectionId,
      inspectionNumber: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Check-in (Return)',
      contractId: rental.id,
      vehicle: rental.vehicle,
      vehicleId: rental.vehicleId || null,
      plate: vehicle?.plate || '',
      driver: rental.driver,
      driverId: rental.driverId || null,
      date: formData.returnDate,
      time: formData.returnTime || '12:00 PM',
      odometer: returnOdoNum,
      fuelLevel: formData.returnFuelLevel,
      exteriorCondition: formData.exteriorCondition,
      interiorCondition: formData.interiorCondition,
      tiresCondition: 'Good (Checked)',
      windshieldStatus: 'Clear / No Cracks',
      spareTirePresent: true,
      inspector: 'John Doe (Admin)',
      status: formData.hasDamage ? 'Damage Detected' : 'Passed',
      notes: formData.hasDamage
        ? `Damage Reported: ${formData.damageNotes}. Remarks: ${formData.remarks}`
        : formData.remarks,
      driverSignature: rental.driver,
      photos: photos
    };
    addInspection(newInspectionRecord);

    // 4. Update Rental status to Completed while preserving agreement snapshot
    const updatedRental = {
      ...rental,
      status: 'Completed',
      returnDateTime: returnDateTimeISO,
      returnOdometer: returnOdoNum,
      returnFuelLevel: formData.returnFuelLevel,
      returnCondition: combinedCondition,
      returnRemarks: formData.remarks,
      returnStatus: 'Returned & Settled',
      hasDamage: formData.hasDamage,
      damageNotes: formData.damageNotes,
      damageFee: damageDeduction,
      distanceTravelled: distanceTravelled,
      returnPhotos: photos,
      settlementSummary: settlement,
      agreementStatus: rental.agreementStatus || 'Signed',
      agreementData: rental.agreementData,
      driverSignature: rental.driverSignature,
      representativeSignature: rental.representativeSignature,
      signedAt: rental.signedAt
    };

    updateRental(rental.id, updatedRental);

    if (onReturnCompleted) {
      onReturnCompleted(updatedRental);
    }

    onClose();
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCompleted ? `Vehicle Return Audit: ${rental.id}` : `Vehicle Return & Check-in: ${rental.id}`}
      subtitle={`Customer: ${rental.customer} • Vehicle: ${rental.vehicle} • Chauffeur: ${rental.driver}`}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleConfirmReturn} className="space-y-6">
        {/* Banner Alert */}
        <div
          className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-xs ${
            isCompleted
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-gradient-to-r from-[#071D49] to-[#0D2D6C] text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-600 text-white' : 'bg-blue-500/20 border border-blue-400/30 text-blue-200'
              }`}
            >
              {isCompleted ? <ClipboardCheck className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold">
                  {isCompleted
                    ? 'Rental Successfully Returned & Settled'
                    : 'Administrator Vehicle Return Console'}
                </h4>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    isCompleted
                      ? 'bg-emerald-200/70 text-emerald-800'
                      : 'bg-blue-400/20 text-blue-200 border border-blue-300/30'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Active Lease Check-in'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-600' : 'text-blue-200'}`}>
                {isCompleted
                  ? `Returned on ${formatDate(rental.returnDateTime || rental.endDate)}. Agreement and deposit settled.`
                  : 'Record return gauge metrics, inspect vehicle condition, calculate deposit settlement, and automatically release vehicle inventory.'}
              </p>
            </div>
          </div>

          {isCompleted && (
            <button
              type="button"
              onClick={handlePrintAudit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer no-print shrink-0"
            >
              <Printer className="w-4 h-4 text-[#075EE8]" /> Print Return Receipt
            </button>
          )}
        </div>

        {/* Section 1: Comparison of Departure vs Return (Odometer & Fuel) */}
        <ReturnMetricsComparison
          rental={rental}
          pickupOdometer={pickupOdometer}
          pickupFuel={pickupFuel}
          pickupCondition={pickupCondition}
          isCompleted={isCompleted}
          distanceTravelled={distanceTravelled}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isOdometerInvalid={isOdometerInvalid}
        />

        {/* Section 2: Physical Condition Assessment, Damage, Photos & Settlement */}
        <ReturnConditionChecklist
          isCompleted={isCompleted}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          rental={rental}
          photos={photos}
          setPhotos={setPhotos}
          settlement={settlement}
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
          >
            {isCompleted ? 'Close' : 'Cancel'}
          </button>

          {!isCompleted && (
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Return &amp; Release Inventory
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
