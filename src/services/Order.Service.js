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
class OrderService {
  // Order configuration
  getOrderList = async (params) => {
    return await axios.post(API_URL + '/api/order/orderlist', params)
  }
  createOrder = async (params) => {
    return await axios.post(API_URL + '/api/order/register', params)
  }
  editOrder = async (params) => {
    return await axios.post(API_URL + '/api/order/edit', params)
  }
  deleteOrder = async (params) => {
    return await axios.post(API_URL + '/api/order/delete', params)
  }
  changeStatusOrder = async (params) => {
    return await axios.post(API_URL + '/api/order/changestatus', params)
  }
  getOrderDetailList = async (params) => {
    return await axios.post(API_URL + '/api/order/orderdetaillist', params)
  }
  changeStatusOrderDetail = async (params) => {
    return await axios.post(API_URL + '/api/order/changestatusdetail', params)
  }
  getVendorOrderList = async (params) => {
    return await axios.post(API_URL + '/api/order/vendororderlist', params)
  }
  changeStatusVendorOrder = async (params) => {
    return await axios.post(API_URL + '/api/order/changestatusvendor', params)
  }
  getTransactionList = async (params) => {
    return await axios.post(API_URL + '/api/order/transactionlist', params)
  }
}

export default new OrderService()
