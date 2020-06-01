import { combineReducers } from 'redux'
import currentUser from './currentUser'

const myReducer = combineReducers({
  currentUser
})

export default myReducer