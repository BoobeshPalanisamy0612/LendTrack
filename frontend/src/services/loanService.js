import api from './api';

export const loanService = {
  getLoans: (params) => api.get('/loans', { params }).then((res) => res.data),
  getLoanById: (id) => api.get(`/loans/${id}`).then((res) => res.data),
  createLoan: (data) => api.post('/loans', data).then((res) => res.data),
  updateLoan: (id, data) => api.put(`/loans/${id}`, data).then((res) => res.data),
  deleteLoan: (id) => api.delete(`/loans/${id}`).then((res) => res.data),
  markPaid: (id, data) => api.post(`/loans/${id}/pay`, data).then((res) => res.data),
  uploadDocuments: (id, formData) =>
    api
      .post(`/loans/${id}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  deleteDocument: (id, docId) => api.delete(`/loans/${id}/documents/${docId}`).then((res) => res.data),
};
