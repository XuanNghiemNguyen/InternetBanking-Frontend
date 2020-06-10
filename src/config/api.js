import axios from 'axios'
import store from '../redux'
import { setCurrentUser } from '../redux/actions'

// axios.defaults.headers['access-token'] = localStorage.getItem('access-token')

const error_exception = (err) => ({
  success: false,
  message: err || 'Lỗi không xác định!'
})

const HOST_URL =
  'http://127.0.0.1:8080' || 'https://sacombank-internet-banking.herokuapp.com'
class API {
  constructor() {
    this.instance = axios.create({
      baseURL: HOST_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('access-token')
      }
    })
    this.login = this.login.bind(this)
    this.getListAccount = this.getListAccount.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.checkActive = this.checkActive.bind(this)
    this.getCode = this.getCode.bind(this)
    this.verifyCode = this.verifyCode.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
  }
  checkActive = async () => {
    return await this.instance
      .get('/')
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  }
  login = async (email, password, remember) => {
    const currentUser = remember ? { email, password } : null
    return await this.instance
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
        localStorage.setItem('loggedIn', true)
        return response.data || error_exception()
      })
      .catch((error) => {
        if (error.response) {
          localStorage.setItem('loggedIn', false)
          return error.response.data || error_exception()
        } else {
          console.log(error)
          return error_exception()
        }
      })
  }
  getListAccount = async (email) => {
    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
    return await this.instance
      .get(`/users/getListAccount?email=${email}`)
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
  getCode = async (email) => {
    return await this.instance
      .get(`/getCode?email=${email}`)
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
  verifyCode = async (email, code) => {
    return await this.instance
      .post('/verifyCode', { email, code })
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
  forgotPassword = async (token, password_1, password_2) => {
    this.instance.defaults.headers['access-token'] = token
    return await this.instance
      .post('/forgotPassword', { password_1, password_2 })
      .then((response) => {
        localStorage.setItem('access-token', 'need login')
        localStorage.setItem('loggedIn', false)
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
  changePassword = async (password_0, password_1, password_2) => {
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
    return await this.instance
      .post('/users/changePassword', { password_0, password_1, password_2 })
      .then((response) => {
        localStorage.setItem('access-token', 'need login')
        localStorage.setItem('loggedIn', false)
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
  getInfo = async () => {
    return await this.instance
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
}
const REST_API = new API()

export { REST_API }
