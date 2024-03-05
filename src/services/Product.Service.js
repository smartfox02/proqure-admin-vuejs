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
class ProductService {
  getProductList = async (params) => {
    return await axios.post(API_URL + '/api/product/productlist', params)
  }
  createProduct = async (params) => {
    return await axios.post(API_URL + '/api/product/register', params)
  }
  editProduct = async (params) => {
    return await axios.post(API_URL + '/api/product/edit', params)
  }
  deleteProduct = async (params) => {
    return await axios.post(API_URL + '/api/product/delete', params)
  }
  editQuantity = async (params) => {
    return await axios.post(API_URL + '/api/product/editquantity', params)
  }
}

export default new ProductService()
