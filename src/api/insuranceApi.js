import { delay, getCachedOrInit, setCached } from './client';
import { initialVehicles } from '../data/mockData';

const CACHE_KEY = 'prime_route_insurance';

const initialInsurance = initialVehicles.map((v, i) => ({
  id: `INS-POL-${String(i + 1).padStart(3, '0')}`,
  vehicleId: v.id,
  vehicleName: v.name,
  plate: v.plate,
  carrier: i % 2 === 0 ? 'Travelers Fleet Assurance' : 'Progressive Commercial',
  policyNumber: `PR-POL-${2025000 + i}`,
  coverageType: 'Full Comprehensive & Collision',
  liabilityLimit: '$1,000,000 Combined Single Limit (CSL)',
  deductible: '$1,000',
  monthlyPremium: 285,
  effectiveDate: '2025-01-01',
  expirationDate: v.insuranceExpiry || '2026-01-01',
  status: 'Active'
}));

export const insuranceApi = {
  async getInsurancePolicies() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialInsurance])];
  },

  async updatePolicy(id, updates) {
    await delay();
    const policies = getCachedOrInit(CACHE_KEY, () => [...initialInsurance]);
    const index = policies.findIndex((p) => p.id === id);
    if (index === -1) return null;

    policies[index] = { ...policies[index], ...updates };
    setCached(CACHE_KEY, [...policies]);
    return { ...policies[index] };
  }
};

