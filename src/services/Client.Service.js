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
class ClientService {
  // Client configuration
  getClientList = async (params) => {
    return await axios.post(API_URL + '/api/client/clientlist', params)
  }
  createClient = async (params) => {
    return await axios.post(API_URL + '/api/client/register', params)
  }
  editClient = async (params) => {
    return await axios.post(API_URL + '/api/client/edit', params)
  }
  deleteClient = async (params) => {
    return await axios.post(API_URL + '/api/client/delete', params)
  }
  changeStatusClient = async (params) => {
    return await axios.post(API_URL + '/api/client/changestatus', params)
  }
  changeSegmentClient = async (params) => {
    return await axios.post(API_URL + '/api/client/changesegment', params)
  }
}

export default new ClientService()
