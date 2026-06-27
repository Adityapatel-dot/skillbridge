import api from './axios'

export const paymentsApi = {
  process: (data) => api.post('/payments', data),
  getMy: () => api.get('/payments/my'),
  getByJob: (jobId) => api.get(`/payments/job/${jobId}`),
  getByWorkRequest: (workRequestId) => api.get(`/payments/work-request/${workRequestId}`),
}
