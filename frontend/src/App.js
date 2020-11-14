import React from 'react'
import { BrowserRouter as  Router, Switch, Route, Redirect } from 'react-router-dom'
import StationLoginPage from './components/StationLoginPage'
import './App.css'
import StationReportPage from './components/StationReportPage'
import StaffLoginPage from './components/StaffLoginPage'
import StaffPage from './components/StaffPage'


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
        <Route path = "/staff/:staffId/:page/:period">
          <StaffPage></StaffPage>
        </Route>
        <Route path = "/staff/:staffId/:page">
          <StaffPage></StaffPage>
        </Route>
        <Redirect from="/staff/:staffId" to="/staff/:staffId/Profile"/>
        <Route path = "/staff">
          <StaffPage></StaffPage>
        </Route>

        {/** Routing for AllStaffs (Admin ) Page*/}
        <Route path = "/AllStaffs/:staffId/:page/:period">
          <StaffPage></StaffPage>
        </Route>
        <Route path = "/AllStaffs/:staffId/:page/">
          <StaffPage></StaffPage>
        </Route>
        <Redirect from="/AllStaffs/:staffId" to="/AllStaffs/:staffId/Profile"/>
        <Route path = "/AllStaffs">
          <StaffPage></StaffPage>
        </Route>

        {/** Routing for ManageTimeSheets (Admin ) Page*/}
        <Route path = "/ManageTimeSheets/:staffId/:period">
          <StaffPage></StaffPage>
        </Route>
        <Route path = "/ManageTimeSheets/:staffId">
          <StaffPage></StaffPage>
        </Route>
        <Route path = "/ManageTimeSheets">
          <StaffPage></StaffPage>
        </Route>

        <Route path = "/Register/:registerCode">
          <StaffPage></StaffPage>
        </Route>

        <Route path = "/">
          <StationLoginPage ></StationLoginPage>
        </Route>
      </Switch>
    </Router>

  )
}

export default App
