import api from './axios'

export const chatApi = {
  send: (data) => api.post('/chat/send', data),
  getConversation: (jobId, otherUserId) => api.get(`/chat/conversation/${jobId}/${otherUserId}`),
  getConversations: () => api.get('/chat/conversations'),
  getUnreadCount: () => api.get('/chat/unread-count'),
  markRead: (jobId, otherUserId) => api.put(`/chat/read/${jobId}/${otherUserId}`),
}
