import axios from 'axios'

const token = localStorage.getItem('access-token')

const headers = {
  'Content-Type': 'application/json',
  'access-token': token
}

const instance = axios.create({
  baseURL: 'http://18.139.1.106:3000/',
  timeout: 5000,
  headers
});

const API = {
}

export { API }