import axios from 'axios'
import store from '../redux'
import { setCurrentUser } from '../redux/actions'

// axios.defaults.headers['access-token'] = localStorage.getItem('access-token')

const error_exception = (err) => ({
  success: false,
  message: err || 'Lỗi không xác định!',
})

const HOST_URL =
  'http://127.0.0.1:8080' || 'https://sacombank-internet-banking.herokuapp.com'
class API {
  constructor() {
    this.instance = axios.create({
      baseURL: HOST_URL,
      timeout: 20000,
    })
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token')
        if (token) {
          config.headers['access-token'] = token
        }
        // config.headers['Content-Type'] = 'application/json';
        return config
      },
      (error) => {
        Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config
        if (
          error.response.data.code === 425
        ) {
          localStorage.clear()
          return Promise.reject(error)
        }

        if (error.response.status === 421 && !originalRequest._retry) {
          originalRequest._retry = true
          const refreshToken = localStorage.getItem('refresh-token')
          const accessToken = localStorage.getItem('access-token')
          return await this.instance
            .post('/refreshToken', {
              refreshToken,
              accessToken
            })
            .then((res) => {
              if (res.status === 200) {
                localStorage.setItem('access-token', res.data.newAccessToken)
                this.instance.defaults.headers['access-token'] = res.data.newAccessToken
                return this.instance(originalRequest)
              }
            })
        }
        return Promise.reject(error)
      }
    )
    this.login = this.login.bind(this)
    this.getListAccount = this.getListAccount.bind(this)
    this.checkActive = this.checkActive.bind(this)
    this.getCode = this.getCode.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.cancelDebt = this.cancelDebt.bind(this)
    this.getNotification = this.getNotification.bind(this)
    this.readNotification = this.readNotification.bind(this)
  }
  // Check Backend
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
  // Lấy lại access-token
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
  // Đăng nhập
  login = async (email, password, remember) => {
    const currentUser = remember ? { email, password } : null
    return await this.instance
      .post('/login', { email, password })
      .then((response) => {
        store.dispatch(setCurrentUser(currentUser))
        localStorage.setItem('access-token', response.data.token)
        localStorage.setItem('refresh-token', response.data.user.refreshToken)
        const { name, email } = response.data.user
        const userInfo = {
          name,
          email,
          loginAt: new Date(),
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

  //Lấy danh sách tài khoản của người dùng (1 payment, n savings)
  getListAccount = async (email) => {
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
  //Lấy thông tin của người dùng 
  getUserByEmail = async (email) => {
    return await this.instance
      .get(`/users/getUserByEmail?email=${email}`)
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
  verifyOTP = async (email, code) => {
    return await this.instance
      .post('/verifyOTP', { email, code })
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

  //Chuyển khoản nội bộ sacombank
  internalTransfer = async (dataInput) => {
    return await this.instance
      .post(`/users/transfer`, { ...dataInput })
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

  // Lấy mã OTP
  getCode = async (email) => {
    localStorage.setItem('codeSent', false)
    return await this.instance
      .post('/getOTP', {
        email,
      })
      .then((response) => {
        localStorage.setItem('codeSent', true)
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

  // Đổi mật khẩu dùng OTP (quên mật khẩu)
  forgotPassword = async (email, code, new_password) => {
    return await this.instance
      .post('/forgotPassword', { email, code, new_password })
      .then((response) => {
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

  //Đổi mật khẩu
  changePassword = async (old_password, new_password) => {
    return await this.instance
      .post('/users/changePassword', { old_password, new_password })
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

  //Lấy danh sách người nhận (Bao gồm cả tài khoản nội bộ và liên ngân hàng)
  getReceivers = async () => {
    return await this.instance
      .get('/users/receivers')
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

  //Cập nhật danh sách người nhận (là mảng do FE tự check thông qua API)
  updateReceivers = async (receivers) => {
    return await this.instance
      .post('users/receivers/update', { receivers })
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

  //Thêm một người nhận mới (hiện tại đang sử dụng trong lưu tài khoản lạ khi chuyển khoản)
  addReceiver = async (receiver) => {
    return await this.instance
      .post('users/receivers/add', { receiver })
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

  // Lấy thông tin 1 user thông qua số tài khoản (Nội bộ)
  getOtherInfo = async (number) => {
    return await this.instance
      .get(`/users/getOtherInfo?number=${number}`)
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
  // Lấy thông tin user từ HHbank
  getUserInfoFromHHBank = async (number) => {
    return await this.instance
      .get(`/users/hhbank/getInfo?number=${number}`)
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
  // Chuyển khoản cho HHBank
  transferToHHBank = async (dataInput) => {
    return await this.instance
      .post(`users/hhbank/transfer`, { ...dataInput })
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

  //Lấy thông tin user từ team 29
  getUserInfoFromTeam29 = async (number) => {
    return await this.instance
      .get(`/users/agribank/getInfo?number=${number}`)
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
  sendDebt = async (info) => {
    console.log(info)
    return await this.instance
      .post('users/sendDebt', { info })
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
  // Chuyển khoản cho Agribank
  transferToAgribank = async (dataInput) => {
    return await this.instance
      .post(`users/agribank/transfer`, { ...dataInput })
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

  getDebt = async () => {
    return await this.instance
      .get('users/getDebt')
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
  cancelDebt = async (info) => {
    return await this.instance
      .post('users/cancelDebt', { info })
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
  payDebt = async (info) => {
    console.log(info)
    return await this.instance
      .post('users/payDebt', { info })
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
  getTransaction = async () => {
    return await this.instance
      .get('users/getTransaction')
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
  getNotification = async () => {
    return await this.instance
      .get('notifications/all')
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
  readNotification = async (id) => {
    return await this.instance
      .get(`notification/read?id=${id}`)
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
