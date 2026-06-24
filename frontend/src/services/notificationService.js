import api from './api';

export const notificationService = {
  getNotifications: (unreadOnly = false) =>
    api.get('/notifications', { params: { unreadOnly } }).then((res) => res.data),
  getReminders: () => api.get('/notifications/reminders').then((res) => res.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllRead: () => api.put('/notifications/read-all').then((res) => res.data),
  deleteNotification: (id) => api.delete(`/notifications/${id}`).then((res) => res.data),
};
