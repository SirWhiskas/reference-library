import axios from 'axios'

const httpClient = axios.create({
  baseURL: 'http://10.92.1.77:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export default {
  get(url, config = {}) {
    return httpClient.get(url, config)
  },
  post(url, data, config = {}) {
    return httpClient.post(url, data, config)
  },
  baseURL: httpClient.defaults.baseURL,
}
