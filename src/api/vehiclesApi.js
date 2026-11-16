import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialVehicles } from '../data/mockData';

const CACHE_KEY = 'prime_route_vehicles';

export const vehiclesApi = {
  async getVehicles() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialVehicles])];
  },

  async getVehicleById(id) {
    await delay();
    const vehicles = getCachedOrInit(CACHE_KEY, () => [...initialVehicles]);
    const vehicle = vehicles.find((v) => v.id === id || v.plate === id);
    if (!vehicle) throw new ApiError(`Vehicle with ID "${id}" not found`, 404);
    return { ...vehicle };
  },

  async createVehicle(vehicleData) {
    await delay();
    const vehicles = getCachedOrInit(CACHE_KEY, () => [...initialVehicles]);

    // Check duplicate VIN
    if (vehicleData.vin) {
      const isDuplicate = vehicles.some(
        (v) => v.vin?.toLowerCase().trim() === vehicleData.vin.toLowerCase().trim()
      );
      if (isDuplicate) {
        throw new ApiError(`Duplicate VIN: Vehicle with VIN "${vehicleData.vin}" already exists.`, 409);
      }
    }

    const newVehicle = {
      id: vehicleData.id || `VEH-${String(vehicles.length + 1).padStart(3, '0')}`,
      status: 'Available',
      ...vehicleData,
      createdAt: new Date().toISOString()
    };

    const updated = [newVehicle, ...vehicles];
    setCached(CACHE_KEY, updated);
    return { ...newVehicle };
  },

  async updateVehicle(id, updates) {
    await delay();
    const vehicles = getCachedOrInit(CACHE_KEY, () => [...initialVehicles]);
    const index = vehicles.findIndex((v) => v.id === id || v.plate === id);
    if (index === -1) throw new ApiError(`Vehicle with ID "${id}" not found`, 404);

    const updatedVehicle = { ...vehicles[index], ...updates, updatedAt: new Date().toISOString() };
    vehicles[index] = updatedVehicle;
    setCached(CACHE_KEY, [...vehicles]);
    return { ...updatedVehicle };
  },

  async deleteVehicle(id) {
    await delay();
    const vehicles = getCachedOrInit(CACHE_KEY, () => [...initialVehicles]);
    const filtered = vehicles.filter((v) => v.id !== id && v.plate !== id);
    setCached(CACHE_KEY, filtered);
    return { success: true };
  }
};

