import React from 'react'
import { BrowserRouter as  Router, Switch, Route, Redirect } from 'react-router-dom'
import StationLoginPage from './components/StationLoginPage'
import './App.css'
import StationReportPage from './components/StationReportPage'
import StaffLoginPage from './components/StaffLoginPage'
import StaffPage from './components/StaffPage'
import AdminPages from './components/AdminPages'


const  App = () =>   {
  return (
    <Router>
      <Switch>
        <Route path = {['/shiftReport/:station/:id','/shiftReport/:id']}>
          <StationReportPage></StationReportPage>
        </Route>

        <Route path = "/stationLogin">
          <StationLoginPage ></StationLoginPage>
        </Route>

        <Route path = "/staffLogin">
          <StaffLoginPage />
        </Route>

        {/**Routing for nonAdmin staff Pages */}
        <Route path ={[ '/staff/:staffId/:page/:period','/staff/:staffId/:page']}>
          <StaffPage></StaffPage>
        </Route>
        <Redirect from="/staff/:staffId" to="/staff/:staffId/Profile"/>
        <Route path = "/staff">
          <StaffPage></StaffPage>
        </Route>

        {/**Routing for /Manage/MyPage */}
        <Redirect from='/Manage/MyPage/:page/:id/:period' to="/Manage/MyPage/:page/:period"/>

        {/**Routing for /Manage/AllStaffs */}
        <Route path = {['/Manage/AllStaffs/:staffId/:page/:period','/Manage/AllStaffs/:staffId/:page/', '/Manage/MyPage/:page/:period','/Manage/MyPage/:page/' ]}>
          <AdminPages></AdminPages>
        </Route>
        <Redirect from="/Manage/AllStaffs/:staffId" to="/Manage/AllStaffs/:staffId/Profile"/>
        <Route path = '/Manage/AllStaffs'>
          <AdminPages></AdminPages>
        </Route>

        {/**Routing for /Manage/ManageTimesheets */}
        <Route path = {['/Manage/ManageTimesheets/:staffId/:period','/Manage/ManageTimesheets/:staffId','/Manage/ManageTimesheets' ]}>
          <AdminPages></AdminPages>
        </Route>


        {/** Routing for /Manage/AllStations */}
        <Route path = {['/Manage/AllStations/:stationId/:page' ]}>
          <AdminPages/>
        </Route>
        <Redirect from='/Manage/AllStations/:stationId' to='/Manage/AllStations/:stationId/BasicInfo'/>
        <Route path = '/Manage/AllStations'>
          <AdminPages/>
        </Route>

        {/**Routing for Manage Page */}
        <Redirect from="/Manage" to="/Manage/MyPage/Profile"/>
        <Route path = '/Manage'>
          <AdminPages></AdminPages>
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
