import apiClient from './apiClient'

export const authApi = {
  register(payload) {
    return apiClient.post('/auth/register', payload)
  },
  login(payload) {
    return apiClient.post('/auth/login', payload)
  },
  logout() {
    return apiClient.post('/auth/logout')
  },
  getMe() {
    return apiClient.get('/auth/me')
  },
}

export default authApi