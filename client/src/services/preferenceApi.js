import apiClient from './apiClient'

export const preferenceApi = {
  getPreferences() {
    return apiClient.get('/users/preferences')
  },
  updatePreferences(payload) {
    return apiClient.put('/users/preferences', payload)
  },
}

export default preferenceApi