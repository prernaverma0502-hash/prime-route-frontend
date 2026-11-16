/**
 * Driver PII Masking Utilities
 * Protects driver privacy according to RBAC specifications
 */

export function maskLicense(license) {
  if (!license) return '••••••••';
  const str = String(license);
  if (str.length <= 4) return '••••';
  return str.slice(0, 2) + '•'.repeat(Math.max(4, str.length - 4)) + str.slice(-2);
}

export function maskDob(dob) {
  if (!dob) return '••••-••-••';
  const str = String(dob);
  // Keep year or mask fully
  if (str.includes('-')) {
    const parts = str.split('-');
    return `••••-••-${parts[2] || '••'}`;
  }
  return '••••-••-••';
}

export function maskAddress(address) {
  if (!address) return '[Restricted PII]';
  const str = String(address);
  const commaIdx = str.indexOf(',');
  if (commaIdx !== -1) {
    return '•••• ' + str.slice(commaIdx + 1).trim();
  }
  return '•••• ' + str.slice(Math.min(5, str.length));
}

/**
 * Returns a driver object with sensitive fields masked if shouldMask is true
 */
export function getMaskedDriver(driver, shouldMask) {
  if (!driver || !shouldMask) return driver;

  return {
    ...driver,
    license: maskLicense(driver.license),
    licenseNumber: maskLicense(driver.licenseNumber || driver.license),
    dob: maskDob(driver.dob),
    dateOfBirth: maskDob(driver.dateOfBirth || driver.dob),
    address: maskAddress(driver.address),
    streetAddress: maskAddress(driver.streetAddress || driver.address),
    isMasked: true,
  };
}

