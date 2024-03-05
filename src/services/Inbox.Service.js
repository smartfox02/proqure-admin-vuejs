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
class InboxService {
  getInboxList = async () => {
    return await axios.post(API_URL + '/api/inbox/inboxlist')
  }
  createInbox = async (params) => {
    return await axios.post(API_URL + '/api/inbox/register', params)
  }
  editInbox = async (params) => {
    return await axios.post(API_URL + '/api/inbox/edit', params)
  }
  deleteInbox = async (params) => {
    return await axios.post(API_URL + '/api/inbox/delete', params)
  }
  makeReadInbox = async (params) => {
    return await axios.post(API_URL + '/api/inbox/makeread', params)
  }
}

export default new InboxService()
