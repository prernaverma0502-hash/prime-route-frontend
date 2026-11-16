// Simulated API client with configurable latency and mock persistence
export const SIMULATED_LATENCY_MS = 120;

export const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// In-memory persistent cache for mock data during user session
const memoryCache = new Map();

export const getCachedOrInit = (key, initialFactory) => {
  if (!memoryCache.has(key)) {
    memoryCache.set(key, initialFactory());
  }
  return memoryCache.get(key);
};

export const setCached = (key, data) => {
  memoryCache.set(key, data);
};

