const reducer = (state,action) => {
  switch(action.type) {
  case 'ADD_LASTSHIFTREPORT':
    return {
      ...state, lastShiftReport: action.payload
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