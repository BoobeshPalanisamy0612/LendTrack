import api from './api';

export const familyService = {
  getFamilyGroup: () => api.get('/family').then((res) => res.data),
  createFamilyGroup: (name) => api.post('/family', { name }).then((res) => res.data),
  inviteMember: (email, role) => api.post('/family/invite', { email, role }).then((res) => res.data),
  acceptInvite: (token) => api.post(`/family/accept-invite/${token}`).then((res) => res.data),
  updateMemberRole: (memberId, role) => api.put(`/family/members/${memberId}/role`, { role }).then((res) => res.data),
  removeMember: (memberId) => api.delete(`/family/members/${memberId}`).then((res) => res.data),
};
