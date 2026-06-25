import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),

  login: async (data) => {
    console.log("LOGIN REQUEST:", data);

    const res = await api.post('/auth/login', data);

    console.log("LOGIN RESPONSE:", res);
    console.log("LOGIN RESPONSE DATA:", res.data);

    return res.data;
  },

  getMe: () => api.get('/auth/me').then((res) => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }).then((res) => res.data),
  updateProfile: (data) => api.put('/auth/profile', data).then((res) => res.data),
  changePassword: (data) => api.put('/auth/change-password', data).then((res) => res.data),
};