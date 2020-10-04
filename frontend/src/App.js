import React from 'react'
import { BrowserRouter as  Router, Switch, Route } from 'react-router-dom'
import LandingPage from './components/LoginPage'
import './App.css'
import StationReportPage from './components/StationReportPage'


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
        <Route path = "/">
          <LandingPage ></LandingPage>
        </Route>
      </Switch>
    </Router>

  )
}

export default App
