import { delay, getCachedOrInit, setCached, ApiError } from './client';
import { initialIncome, initialInvoices } from '../data/mockData';

const INCOME_CACHE = 'prime_route_payments';
const INVOICES_CACHE = 'prime_route_invoices';

export const paymentsApi = {
  async getPayments() {
    await delay();
    return [...getCachedOrInit(INCOME_CACHE, () => [...initialIncome])];
  },

  async getInvoices() {
    await delay();
    return [...getCachedOrInit(INVOICES_CACHE, () => [...initialInvoices])];
  },

  async recordPayment(paymentData) {
    await delay();
    const payments = getCachedOrInit(INCOME_CACHE, () => [...initialIncome]);

    const newPayment = {
      id: paymentData.id || `PAY-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...paymentData
    };

    const updated = [newPayment, ...payments];
    setCached(INCOME_CACHE, updated);
    return { ...newPayment };
  },

  async createInvoice(invoiceData) {
    await delay();
    const invoices = getCachedOrInit(INVOICES_CACHE, () => [...initialInvoices]);

    const newInvoice = {
      id: invoiceData.id || `INV-${String(invoices.length + 101).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Unpaid',
      ...invoiceData
    };

    const updated = [newInvoice, ...invoices];
    setCached(INVOICES_CACHE, updated);
    return { ...newInvoice };
  }
};

