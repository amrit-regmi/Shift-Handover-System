import React, { useEffect } from 'react'
import { Message } from 'semantic-ui-react'

const Notification  = ({ dispatch , notification }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION' , payload: { id: notification.id } })
    },5000)
    return () => {
      clearTimeout(timeout)}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Message
      success = {notification.type === 'SUCCESS'}
      error={notification.type === 'ERROR'}
      attached
      onDismiss = {() => dispatch({ type: 'REMOVE_NOTIFICATION' , payload: { id: notification.id } })}
    >
      {notification.content}
    </Message>
  )
}

export default Notification