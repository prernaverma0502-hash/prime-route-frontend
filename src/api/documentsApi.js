import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialDocuments } from '../data/mockData';

const CACHE_KEY = 'prime_route_documents';

export const documentsApi = {
  async getDocuments() {
    await delay();
    return [...getCachedOrInit(CACHE_KEY, () => [...initialDocuments])];
  },

  async uploadDocument(docData) {
    await delay();
    const docs = getCachedOrInit(CACHE_KEY, () => [...initialDocuments]);

    const newDoc = {
      id: docData.id || `DOC-${String(docs.length + 1).padStart(3, '0')}`,
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'Valid',
      ...docData
    };

    const updated = [newDoc, ...docs];
    setCached(CACHE_KEY, updated);
    return { ...newDoc };
  },

  async deleteDocument(id) {
    await delay();
    const docs = getCachedOrInit(CACHE_KEY, () => [...initialDocuments]);
    const filtered = docs.filter((d) => d.id !== id);
    setCached(CACHE_KEY, filtered);
    return { success: true };
  }
};

