import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary').then((res) => res.data),
  getMonthlyStats: (months = 6) => api.get('/dashboard/monthly-stats', { params: { months } }).then((res) => res.data),
};
