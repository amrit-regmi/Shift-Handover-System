import React from 'react'
import { BrowserRouter as  Router, Switch, Route } from 'react-router-dom'
import StationLoginPage from './components/StationLoginPage'
import './App.css'
import StationReportPage from './components/StationReportPage'
import StaffLoginPage from './components/StaffLoginPage'
import StaffPage from './components/StaffPage'
import Profile from './components/StaffPage/Profile'


const  App = () =>   {
  return (
    <Router>
      <Switch>
        <Route path = "/shiftReport/:station/:id">
          <StationReportPage></StationReportPage>
        </Route>
        <Route path = "/shiftReport/:id">
          <StationReportPage></StationReportPage>
        </Route>
        <Route path = "/stationLogin">
          <StationLoginPage ></StationLoginPage>
        </Route>
        <Route path = "/staffLogin">
          <StaffLoginPage />
        </Route>
        <Route path = "/staff/:id">
          <StaffPage></StaffPage>
        </Route>
        <Route path = "/administration/staff/:id">
          <Profile></Profile>
        </Route>
        <Route path = "/">
          <StationLoginPage ></StationLoginPage>
        </Route>
      </Switch>
    </Router>

  )
}

export default App
