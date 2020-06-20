let initialState = null

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_CURRENT_USER') {
    state = action.currentUser
    return state
  }
  return state
}

export default reducer
