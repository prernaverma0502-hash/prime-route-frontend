import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialTolls, initialTickets } from '../data/mockData';

const TOLLS_CACHE = 'prime_route_tolls';
const TICKETS_CACHE = 'prime_route_tickets';

export const tollsApi = {
  async getTolls() {
    await delay();
    return [...getCachedOrInit(TOLLS_CACHE, () => [...initialTolls])];
  },

  async getTickets() {
    await delay();
    return [...getCachedOrInit(TICKETS_CACHE, () => [...initialTickets])];
  },

  async createTicket(ticketData) {
    await delay();
    const tickets = getCachedOrInit(TICKETS_CACHE, () => [...initialTickets]);

    const newTicket = {
      id: ticketData.id || `TCK-${String(tickets.length + 1).padStart(3, '0')}`,
      status: ticketData.status || 'Unpaid',
      createdAt: new Date().toISOString(),
      ...ticketData
    };

    const updated = [newTicket, ...tickets];
    setCached(TICKETS_CACHE, updated);
    return { ...newTicket };
  },

  async updateTicket(id, updates) {
    await delay();
    const tickets = getCachedOrInit(TICKETS_CACHE, () => [...initialTickets]);
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) throw new ApiError(`Ticket "${id}" not found`, 404);

    const updated = { ...tickets[index], ...updates };
    tickets[index] = updated;
    setCached(TICKETS_CACHE, [...tickets]);
    return { ...updated };
  }
};

