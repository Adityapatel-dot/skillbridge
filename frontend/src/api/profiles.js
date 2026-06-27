import api from './axios'

export const profilesApi = {
  getMe: () => api.get('/profiles/me'),
  updateMe: (data) => api.put('/profiles/me', data),
  getById: (id) => api.get(`/profiles/${id}`),
  getWorkers: () => api.get('/profiles/workers'),
  getWorkersBySkill: (skill) => api.get('/profiles/workers/by-skill', { params: { skill } }),
}
