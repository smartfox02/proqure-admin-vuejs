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
class TransporterService {
  // Transporter configuration
  getTransporterList = async (params) => {
    return await axios.post(API_URL + '/api/user/userlist', params)
  }
  createTransporter = async (params) => {
    return await axios.post(API_URL + '/api/user/register', params)
  }
  editTransporter = async (params) => {
    return await axios.post(API_URL + '/api/user/edit', params)
  }
  deleteTransporter = async (params) => {
    return await axios.post(API_URL + '/api/user/delete', params)
  }
  changeStatusVender = async (params) => {
    return await axios.post(API_URL + '/api/user/changestatus', params)
  }
}

export default new TransporterService()
