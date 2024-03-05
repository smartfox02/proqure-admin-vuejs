import axios from 'axios'
import router from '@/router'
import { API_URL } from '@/config'
axios.defaults.headers.common['Authorization'] =
  window.localStorage.getItem('token')
// const config = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// }
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
class VendorService {
  // Vendor configuration
  getVendorList = async (params) => {
    return await axios.post(API_URL + '/api/user/userlist', params)
  }
  createVendor = async (params) => {
    return await axios.post(API_URL + '/api/user/register', params)
  }
  editVendor = async (params) => {
    return await axios.post(API_URL + '/api/user/edit', params)
  }
  deleteVendor = async (params) => {
    return await axios.post(API_URL + '/api/user/delete', params)
  }
  changeStatusVender = async (params) => {
    return await axios.post(API_URL + '/api/user/changestatus', params)
  }
}

export default new VendorService()
