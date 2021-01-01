import React from 'react'
import './App.css'
import AppRouter from './router'
import { NotificationProvider } from './contexts/NotificationContext'


const  App = () =>   {
  return (
    <NotificationProvider>
      <AppRouter></AppRouter>
    </NotificationProvider>
  )
}

export default App
