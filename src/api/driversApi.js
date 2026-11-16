import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialDrivers } from '../data/mockData';

const CACHE_KEY = 'prime_route_drivers';

export const driversApi = {
  async getDrivers() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialDrivers])];
  },

  async getDriverById(id) {
    await delay();
    const drivers = getCachedOrInit(CACHE_KEY, () => [...initialDrivers]);
    const driver = drivers.find((d) => d.id === id || d.name === id);
    if (!driver) throw new ApiError(`Driver with ID "${id}" not found`, 404);
    return { ...driver };
  },

  async createDriver(driverData) {
    await delay();
    const drivers = getCachedOrInit(CACHE_KEY, () => [...initialDrivers]);

    const newDriver = {
      id: driverData.id || `DRV-${String(drivers.length + 101)}`,
      status: 'Active',
      balance: '$0',
      tripsCompleted: 0,
      ...driverData,
      createdAt: new Date().toISOString()
    };

    const updated = [newDriver, ...drivers];
    setCached(CACHE_KEY, updated);
    return { ...newDriver };
  },

  async updateDriver(id, updates) {
    await delay();
    const drivers = getCachedOrInit(CACHE_KEY, () => [...initialDrivers]);
    const index = drivers.findIndex((d) => d.id === id || d.name === id);
    if (index === -1) throw new ApiError(`Driver with ID "${id}" not found`, 404);

    const updatedDriver = { ...drivers[index], ...updates, updatedAt: new Date().toISOString() };
    drivers[index] = updatedDriver;
    setCached(CACHE_KEY, [...drivers]);
    return { ...updatedDriver };
  },

  async deleteDriver(id) {
    await delay();
    const drivers = getCachedOrInit(CACHE_KEY, () => [...initialDrivers]);
    const filtered = drivers.filter((d) => d.id !== id && d.name !== id);
    setCached(CACHE_KEY, filtered);
    return { success: true };
  }
};

