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
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('access-token'),
      },
    })
    this.login = this.login.bind(this)
    this.getListAccount = this.getListAccount.bind(this)
    this.checkActive = this.checkActive.bind(this)
    this.getCode = this.getCode.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.cancelDebt = this.cancelDebt.bind(this)
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
  // Đăng nhập
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

  //Chuyển khoản nội bộ sacombank
  internalTransfer = async (dataInput) => {
    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
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
}
const REST_API = new API()

export { REST_API }
