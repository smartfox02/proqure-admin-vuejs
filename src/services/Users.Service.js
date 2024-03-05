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
class UsersService {
  getUserList = async () => {
    return await axios.post(API_URL + '/api/user/userlist', { role: 'all' })
  }
  createUser = async (params) => {
    return await axios.post(API_URL + '/api/user/register', params)
  }
  editUser = async (params) => {
    return await axios.post(API_URL + '/api/user/edit', params)
  }
  deleteUser = async (params) => {
    return await axios.post(API_URL + '/api/user/delete', params)
  }
}

export default new UsersService()
