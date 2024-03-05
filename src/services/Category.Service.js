import axios from 'axios'
import router from '@/router'
import { API_URL } from '@/config'
axios.defaults.headers.common['Authorization'] =
  window.localStorage.getItem('token')
const instance = axios.create({ baseURL: API_URL })
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('=============error:', error)
    if (error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  },
)
class CategoryService {
  getCategoryList = async () => {
    return await axios.post(API_URL + '/api/category/categorylist')
  }
  createCategory = async (params) => {
    return await axios.post(API_URL + '/api/category/register', params)
  }
  editCategory = async (params) => {
    return await axios.post(API_URL + '/api/category/edit', params)
  }
  deleteCategory = async (params) => {
    return await axios.post(API_URL + '/api/category/delete', params)
  }
}

export default new CategoryService()
