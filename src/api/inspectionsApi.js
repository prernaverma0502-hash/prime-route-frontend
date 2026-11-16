import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialInspections, initialAccidents } from '../data/mockData';

const INSPECTIONS_CACHE = 'prime_route_inspections';
const ACCIDENTS_CACHE = 'prime_route_accidents';

export const inspectionsApi = {
  async getInspections() {
    await delay();
    return [...getCachedOrInit(INSPECTIONS_CACHE, () => [...initialInspections])];
  },

  async getAccidents() {
    await delay();
    return [...getCachedOrInit(ACCIDENTS_CACHE, () => [...initialAccidents])];
  },

  async createInspection(inspectionData) {
    await delay();
    const list = getCachedOrInit(INSPECTIONS_CACHE, () => [...initialInspections]);

    const newInspection = {
      id: inspectionData.id || `INS-${String(list.length + 101)}`,
      date: new Date().toISOString().split('T')[0],
      status: inspectionData.status || 'Completed',
      ...inspectionData
    };

    const updated = [newInspection, ...list];
    setCached(INSPECTIONS_CACHE, updated);
    return { ...newInspection };
  },

  async reportAccident(accidentData) {
    await delay();
    const accidents = getCachedOrInit(ACCIDENTS_CACHE, () => [...initialAccidents]);

    const newAccident = {
      id: accidentData.id || `ACC-${String(accidents.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: accidentData.status || 'Reported',
      ...accidentData
    };

    const updated = [newAccident, ...accidents];
    setCached(ACCIDENTS_CACHE, updated);
    return { ...newAccident };
  }
};

