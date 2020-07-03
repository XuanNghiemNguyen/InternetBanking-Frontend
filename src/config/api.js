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
      timeout: 10000,
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
    this.deposit = this.deposit.bind(this)
    this.createUser = this.createUser.bind(this)
    this.sendHistory = this.sendHistory.bind(this)
    this.receiveHistory = this.receiveHistory.bind(this)
    this.debtHistory = this.debtHistory.bind(this)
  }
  createUser = async (info)=>{
    console.log(info)
    return await this.instance
    .post(`/employee/createUser`,info)
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
  deposit = async (info)=>{
    return await this.instance
    .post(`/employee/deposit`,info)
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
  sendHistory = async (stk) => {
    return await this.instance
    .post(`/employee/sendHistory`,stk)
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
  receiveHistory = async (stk) => {
    return await this.instance
    .post(`/employee/receiveHistory`,stk)
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
  debtHistory = async (stk) => {
    return await this.instance
    .post(`/employee/debtHistory`,stk)
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
        const { name, email,type } = response.data.user
        const userInfo = {
          name,
          email,
          loginAt: new Date(),
        }
        localStorage.setItem('user-info', JSON.stringify(userInfo))
        localStorage.setItem('loggedIn', true)
        localStorage.setItem('type', type)
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
  getOtherUser = async () => {

    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
    return await this.instance
      .get(`/users/getAllAccount`)

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
  getUserByEmail = async (email) => {
    const token = localStorage.getItem('access-token')
    if (!token) return error_exception('token not found')
    this.instance.defaults.headers['access-token'] = token
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
  getUserInfoFromTeam29 = async (number) => {
    this.instance.defaults.headers['access-token'] = localStorage.getItem(
      'access-token'
    )
    return await this.instance
      .get(`/users/team29/getInfo?number=${number}`)
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
