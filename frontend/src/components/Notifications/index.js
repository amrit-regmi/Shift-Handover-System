import React, { useContext } from 'react'
import { Segment } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import Notification from './Notification'

const Notifications = () => {
  const [notifications,dispatch] = useContext(NotificationContext)
  return (
    <Segment basic  style={{
      width: 'inherit',
      position: 'fixed',
      zIndex: 1000,
      padding:0
    }}>
      {notifications.map(notification =>
        <Notification key={notification.id} notification= {notification} dispatch= {dispatch} ></Notification>
      )}
    </Segment>

  )
}

export default Notifications