import api from './axios'

export const reviewsApi = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getUserAverage: (userId) => api.get(`/reviews/user/${userId}/average`),
}
