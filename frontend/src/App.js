import React from 'react'
import { BrowserRouter as  Router, Switch, Route, Redirect } from 'react-router-dom'
import StationLoginPage from './components/StationLoginPage'
import './App.css'
import StationReportPage from './components/StationReportPage'
import StaffLoginPage from './components/StaffLoginPage'
import StaffPage from './components/StaffPage'
import AdminPages from './components/AdminPages'
import AppRouter from './router'
import Notifications from './components/Notifications'
import { NotificationProvider } from './contexts/NotificationContext'
import { Segment } from 'semantic-ui-react'


const  App = () =>   {
  return (
    <NotificationProvider>
      <AppRouter></AppRouter>
    </NotificationProvider>
  )
}

export default App
