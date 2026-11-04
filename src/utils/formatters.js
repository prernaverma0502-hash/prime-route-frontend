// Utility formatters for PrimeRoute

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
    case 'active':
    case 'paid':
    case 'completed':
    case 'good':
    case 'verified':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'rented':
    case 'in progress':
    case 'upcoming':
    case 'pending':
    case 'processing':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      };
    case 'maintenance':
    case 'scheduled':
    case 'expiring soon':
    case 'due soon':
    case 'warning':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'inactive':
    case 'unpaid':
    case 'overdue':
    case 'cancelled':
    case 'expired':
    case 'danger':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500'
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
};

