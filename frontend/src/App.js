import React from 'react';
import {BrowserRouter as  Router, Switch, Route, Link } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import './App.css';
import ShiftReportPage from './components/ShiftReportPage';

const  App = () =>   {
  return (
    <Router>
    <Switch>
      <Route path = "/shiftReport/:station/:id">
        <ShiftReportPage></ShiftReportPage>
      </Route>
      <Route path = "/shiftReport/:id">
        <ShiftReportPage></ShiftReportPage>
      </Route>
      <Route path = "/">
        <LandingPage></LandingPage>
      </Route>
    </Switch>
    </Router>

  );
}

export default App;
