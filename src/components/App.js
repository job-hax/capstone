import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './home/HomePage';
import PageNotFound from './PageNotFound';
import SiteHeader from './common/header/Header';
import JobsPage from './jobs/JobsPage';
import LoginPage from './authentication/login/LoginPage';

function App() {
  return (
    <div className="container">
      <SiteHeader />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/jobs" component={JobsPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
