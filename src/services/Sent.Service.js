import axios from 'axios'
import router from '@/router'
import { API_URL } from '@/config'
axios.defaults.headers.common['Authorization'] =
  window.localStorage.getItem('token')
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Redirect to the login page
      router.push('/login')
    }
    return Promise.reject(error)
  },
)
class SentService {
  getSentList = async () => {
    return await axios.post(API_URL + '/api/sent/sentlist')
  }
  createSent = async (params) => {
    return await axios.post(API_URL + '/api/sent/register', params)
  }
  editSent = async (params) => {
    return await axios.post(API_URL + '/api/sent/edit', params)
  }
  deleteSent = async (params) => {
    return await axios.post(API_URL + '/api/sent/delete', params)
  }
}

export default new SentService()
