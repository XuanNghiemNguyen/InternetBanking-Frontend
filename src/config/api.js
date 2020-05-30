import axios from 'axios'

const token = localStorage.getItem('access-token') || 'default'

const headers = {
  'Content-Type': 'application/json',
  'access-token': token
}

const instance = axios.create({
  baseURL: 'https://https://sacombank-internet-banking.herokuapp.com/',
  timeout: 5000,
  headers
});

const API = {
}

export { API }