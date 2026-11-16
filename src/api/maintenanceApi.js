import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialMaintenance } from '../data/mockData';

const CACHE_KEY = 'prime_route_maintenance';

export const maintenanceApi = {
  async getMaintenanceRecords() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialMaintenance])];
  },

  async createMaintenanceRecord(recordData) {
    await delay();
    const records = getCachedOrInit(CACHE_KEY, () => [...initialMaintenance]);

    const newRecord = {
      id: recordData.id || `MNT-${String(records.length + 1).padStart(3, '0')}`,
      status: recordData.status || 'Scheduled',
      createdAt: new Date().toISOString(),
      ...recordData
    };

    const updated = [newRecord, ...records];
    setCached(CACHE_KEY, updated);
    return { ...newRecord };
  },

  async updateMaintenanceRecord(id, updates) {
    await delay();
    const records = getCachedOrInit(CACHE_KEY, () => [...initialMaintenance]);
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) throw new ApiError(`Maintenance record "${id}" not found`, 404);

    const updated = { ...records[index], ...updates };
    records[index] = updated;
    setCached(CACHE_KEY, [...records]);
    return { ...updated };
  }
};

