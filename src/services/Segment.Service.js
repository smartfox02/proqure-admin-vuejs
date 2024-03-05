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
class SegmentService {
  getSegmentList = async () => {
    return await axios.post(API_URL + '/api/segment/segmentlist')
  }
  createSegment = async (params) => {
    return await axios.post(API_URL + '/api/segment/register', params)
  }
  editSegment = async (params) => {
    return await axios.post(API_URL + '/api/segment/edit', params)
  }
  deleteSegment = async (params) => {
    return await axios.post(API_URL + '/api/segment/delete', params)
  }
}

export default new SegmentService()
