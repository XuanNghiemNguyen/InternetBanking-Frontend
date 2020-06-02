import axios from 'axios'
import store from '../redux'
import { setCurrentUser } from '../redux/actions'
const headers = {
  'Content-Type': 'application/json',
  'access-token': localStorage.getItem('access-token') || false
}
const HOST_URL = 'https://sacombank-internet-banking.herokuapp.com'
const LOCAL_URL = 'http://127.0.0.1:8080'
const instance = axios.create({
  baseURL: HOST_URL,
  timeout: 10000,
  headers
})

const error_exception = (err) => ({
  success: false,
  message: err || 'Lỗi không xác định!'
})

const API = {
  checkActive: async () => {
    return await instance
      .get('/')
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  },
  login: async (email, password, remember) => {
    const currentUser = remember ? { email, password } : null
    return await instance
      .post('/login', { email, password })
      .then((response) => {
        store.dispatch(setCurrentUser(currentUser))
        localStorage.setItem('access-token', response.data.token)
        const { name, email } = response.data.user
        const userInfo = {
          name,
          email,
          loginAt: new Date()
        }
        localStorage.setItem('user-info', JSON.stringify(userInfo))
        return response.data || error_exception()
      })
      .catch((error) => {
        if (error.response) {
          return error.response.data || error_exception()
        } else {
          console.log(error)
          return error_exception()
        }
      })
  },
  getInfo: async () =>
    await instance
      .get('/users/info')
      .then((response) => {
        return response.data || error_exception()
      })
      .catch((error) => {
        if (error.response) {
          return error.response.data || error_exception()
        } else {
          console.log(error)
          return error_exception()
        }
      })
}

export { API }
