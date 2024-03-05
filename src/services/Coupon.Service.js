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
class CouponService {
  getCouponList = async () => {
    return await axios.post(API_URL + '/api/coupon/couponlist')
  }
  createCoupon = async (params) => {
    return await axios.post(API_URL + '/api/coupon/register', params)
  }
  editCoupon = async (params) => {
    return await axios.post(API_URL + '/api/coupon/edit', params)
  }
  deleteCoupon = async (params) => {
    return await axios.post(API_URL + '/api/coupon/delete', params)
  }
}

export default new CouponService()
