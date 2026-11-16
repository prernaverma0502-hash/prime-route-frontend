import { delay, getCachedOrInit, setCached } from './client';
import { initialSettings } from '../data/mockData';

const CACHE_KEY = 'prime_route_audit_trail';

export const auditApi = {
  async getAuditLogs() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...(initialSettings.auditTrail || [])])];
  },

  async appendAuditLog(entry) {
    await delay(30);
    const logs = getCachedOrInit(CACHE_KEY, () => [...(initialSettings.auditTrail || [])]);

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: entry.user || 'System / Admin',
      action: entry.action || 'Record Modified',
      module: entry.module || 'System',
      details: entry.details || 'Operational record updated',
      severity: entry.severity || 'low'
    };

    const updated = [newLog, ...logs];
    setCached(CACHE_KEY, updated);
    return { ...newLog };
  }
};

