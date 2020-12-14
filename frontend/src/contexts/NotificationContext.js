import React, { createContext, useReducer } from 'react'
import Notifications from '../components/Notifications'

export const NotificationContext = createContext()

const initialState = []

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'


export const notificationReducer = (state ,action) => {
  console.log('this is initialized')
  console.log(action.type)
  switch (action.type){
  case ADD_NOTIFICATION:
    return [
      ...state, {
        id: state.length +1,
        content : action.payload.content,
        type: action.payload.type
      }
    ]
  case REMOVE_NOTIFICATION:

    return state.filter (n => n.id !== action.payload.id)

  default:
    return state
  }
}

export const NotificationProvider = props => {
  const notifications = useReducer (notificationReducer, initialState)
  return (
    <NotificationContext.Provider value = {notifications}>
      <Notifications/>
      {props.children}
    </NotificationContext.Provider>
  )
}