import api from './axios'

export const requestsApi = {
  create: (data) => api.post('/requests', data),
  getReceived: () => api.get('/requests/received'),
  getSent: () => api.get('/requests/sent'),
  accept: (id) => api.put(`/requests/${id}/accept`),
  reject: (id) => api.put(`/requests/${id}/reject`),
  start: (id) => api.put(`/requests/${id}/start`),
  complete: (id) => api.put(`/requests/${id}/complete`),
  approve: (id) => api.put(`/requests/${id}/approve`),
}
