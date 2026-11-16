import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialVendors } from '../data/mockData';

const CACHE_KEY = 'prime_route_vendors';

export const vendorsApi = {
  async getVendors() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...(initialVendors || [])])];
  },

  async createVendor(vendorData) {
    await delay();
    const vendors = getCachedOrInit(CACHE_KEY, () => [...(initialVendors || [])]);

    const newVendor = {
      id: vendorData.id || `VND-${String(vendors.length + 1).padStart(3, '0')}`,
      status: 'Active Partner',
      spendYTD: 0,
      ...vendorData
    };

    const updated = [newVendor, ...vendors];
    setCached(CACHE_KEY, updated);
    return { ...newVendor };
  },

  async updateVendor(id, updates) {
    await delay();
    const vendors = getCachedOrInit(CACHE_KEY, () => [...(initialVendors || [])]);
    const index = vendors.findIndex((v) => v.id === id);
    if (index === -1) throw new ApiError(`Vendor "${id}" not found`, 404);

    vendors[index] = { ...vendors[index], ...updates };
    setCached(CACHE_KEY, [...vendors]);
    return { ...vendors[index] };
  }
};

