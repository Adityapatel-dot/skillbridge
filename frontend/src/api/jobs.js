import api from './axios'

export const jobsApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getNearby: (params) => api.get('/jobs/nearby', { params }),
  getMy: () => api.get('/jobs/my'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  assign: (id, workerId) => api.put(`/jobs/${id}/assign/${workerId}`),
  start: (id) => api.put(`/jobs/${id}/start`),
  complete: (id) => api.put(`/jobs/${id}/complete`),
  approve: (id) => api.put(`/jobs/${id}/approve`),
  review: (id) => api.put(`/jobs/${id}/review`),
}
