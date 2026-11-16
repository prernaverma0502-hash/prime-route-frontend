import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialRentals } from '../data/mockData';

const CACHE_KEY = 'prime_route_rentals';

export const rentalsApi = {
  async getRentals() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialRentals])];
  },

  async getRentalById(id) {
    await delay();
    const rentals = getCachedOrInit(CACHE_KEY, () => [...initialRentals]);
    const rental = rentals.find((r) => r.id === id);
    if (!rental) throw new ApiError(`Rental contract "${id}" not found`, 404);
    return { ...rental };
  },

  async createRental(rentalData) {
    await delay();
    const rentals = getCachedOrInit(CACHE_KEY, () => [...initialRentals]);

    // Check overlapping active rental for same vehicle
    if (rentalData.vehicleId || rentalData.vehicle) {
      const targetVeh = rentalData.vehicleId || rentalData.vehicle;
      const hasConflict = rentals.some((r) => {
        if (r.status !== 'Active') return false;
        const matchesVeh = (r.vehicleId && r.vehicleId === targetVeh) || r.vehicle === targetVeh;
        return matchesVeh;
      });

      if (hasConflict) {
        throw new ApiError(
          `Overlapping Rental Conflict: Vehicle "${rentalData.vehicle}" is currently assigned to an ongoing active rental.`,
          409
        );
      }
    }

    const newRental = {
      id: rentalData.id || `RNT-${String(rentals.length + 1).padStart(4, '0')}`,
      status: rentalData.status || 'Active',
      paymentStatus: rentalData.paymentStatus || 'Pending',
      createdAt: new Date().toISOString(),
      ...rentalData
    };

    const updated = [newRental, ...rentals];
    setCached(CACHE_KEY, updated);
    return { ...newRental };
  },

  async updateRental(id, updates) {
    await delay();
    const rentals = getCachedOrInit(CACHE_KEY, () => [...initialRentals]);
    const index = rentals.findIndex((r) => r.id === id);
    if (index === -1) throw new ApiError(`Rental "${id}" not found`, 404);

    const updatedRental = { ...rentals[index], ...updates, updatedAt: new Date().toISOString() };
    rentals[index] = updatedRental;
    setCached(CACHE_KEY, [...rentals]);
    return { ...updatedRental };
  },

  async deleteRental(id) {
    await delay();
    const rentals = getCachedOrInit(CACHE_KEY, () => [...initialRentals]);
    const filtered = rentals.filter((r) => r.id !== id);
    setCached(CACHE_KEY, filtered);
    return { success: true };
  }
};

