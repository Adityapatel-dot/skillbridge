import api from './axios'

export const applicationsApi = {
  create: (data) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getReceived: () => api.get('/applications/received'),
  accept: (id) => api.put(`/applications/${id}/accept`),
  reject: (id) => api.put(`/applications/${id}/reject`),
}
