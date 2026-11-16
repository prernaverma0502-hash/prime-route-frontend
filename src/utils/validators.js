/**
 * PrimeRoute Form & Business Validation Utilities
 * Aligned with Client PDF Acceptance Criteria & Data Integrity
 */

// Basic Required Field Validator
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Email Validator
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

// Phone Validator
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Allows optional +, dashes, parentheses, dots, spaces, min 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

// Positive Number Validator
export const isPositiveNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// Non-Negative Number Validator (>= 0)
export const isNonNegativeNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

// Date Sequence Validator: End Date must be strictly after Start Date
export const isEndDateAfterStartDate = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  return end.getTime() >= start.getTime();
};

/**
 * Standard 17-character VIN Validator
 * Standard North American / ISO 3779 VIN format: 17 alphanumeric, excluding I, O, Q
 */
export const isValidVin = (vin) => {
  if (!vin || typeof vin !== 'string') return false;
  const cleaned = vin.toUpperCase().trim();
  // Must be exactly 17 characters, no I, O, Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(cleaned);
};

/**
 * Duplicate VIN Checker across vehicle list
 * @param {string} vin
 * @param {Array} existingVehicles
 * @param {string|null} currentVehicleId - If editing existing vehicle, ignore self
 */
export const isDuplicateVin = (vin, existingVehicles = [], currentVehicleId = null) => {
  if (!vin || !Array.isArray(existingVehicles)) return false;
  const cleanVin = vin.toUpperCase().trim();
  return existingVehicles.some((veh) => {
    if (currentVehicleId && (veh.id === currentVehicleId || veh.plate === currentVehicleId)) {
      return false;
    }
    return veh.vin && veh.vin.toUpperCase().trim() === cleanVin;
  });
};

/**
 * Overlapping Active Rental Checker
 * @param {string} vehicleIdOrName
 * @param {string} startDate
 * @param {string} endDate
 * @param {Array} existingRentals
 * @param {string|null} currentRentalId
 */
export const isOverlappingRental = (
  vehicleIdOrName,
  startDate,
  endDate,
  existingRentals = [],
  currentRentalId = null
) => {
  if (!vehicleIdOrName || !startDate || !existingRentals) return false;

  const reqStart = new Date(startDate).getTime();
  const reqEnd = endDate ? new Date(endDate).getTime() : Infinity;

  return existingRentals.some((r) => {
    if (currentRentalId && r.id === currentRentalId) return false;
    if (r.status !== 'Active') return false;

    const matchesVehicle =
      (r.vehicleId && r.vehicleId === vehicleIdOrName) ||
      (r.vehicle && r.vehicle.toLowerCase().includes(vehicleIdOrName.toLowerCase())) ||
      vehicleIdOrName.toLowerCase().includes(r.vehicle?.toLowerCase());

    if (!matchesVehicle) return false;

    const rStart = new Date(r.startDate).getTime();
    const rEnd = r.endDate ? new Date(r.endDate).getTime() : Infinity;

    // Check date interval overlap
    return reqStart <= rEnd && reqEnd >= rStart;
  });
};

