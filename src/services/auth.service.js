import axios from 'axios'
import router from '@/router'
import { API_URL } from '@/config'
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
class AuthService {
  login = async (user) => {
    return await axios
      .post(API_URL + '/api/user/login', {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('token', response.data.token)
          axios.defaults.headers.common['Authorization'] = response.data.token
        }
        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  register = async (user) => {
    return await axios.post(API_URL + 'auth/user/register', {
      username: user.username,
      password: user.password,
    })
  }
  editProfile = async (user) => {
    const id = JSON.parse(localStorage.getItem('user')).id
    return await axios.put(API_URL + 'auth', {
      id,
      username: user.username,
      oldpassword: user.oldPassword,
      newpassword: user.newPassword,
    })
  }
}

export default new AuthService()
