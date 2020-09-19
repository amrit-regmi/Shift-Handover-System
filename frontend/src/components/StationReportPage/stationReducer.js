const reducer = (state,action) => {
  switch(action.type) {
  case 'ADD_TASKS':
    return {
      ...state, tasks: [...state.tasks,...action.payload]
    }
  case 'INIT_STATION':
    return {
      ...state, station: action.payload
    }
  default:
    return state
  }
}

export default reducer