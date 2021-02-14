import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Home from '../views/home/index';

// PAGES

function Router() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
    </BrowserRouter>
  );
}
export default Router;
