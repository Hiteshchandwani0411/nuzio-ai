import apiClient from './apiClient'

export const newsApi = {
  getPersonalized() {
    return apiClient.get('/news/personalized')
  },
  getFeed(params) {
    return apiClient.get('/news', { params })
  },
  getArticle(id) {
    return apiClient.get(`/news/${id}`)
  },
  search(query) {
    return apiClient.get('/news/search', { params: { query } })
  },
}

export default newsApi