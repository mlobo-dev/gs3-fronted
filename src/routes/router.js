import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Home from '../views/home/index';
import Cliente from '../views/cliente';
import ClienteCadastro from '../views/cliente/cadastro';

// PAGES

function Router() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/clientes" component={Cliente} />
      <Route exact path="/clientes/cadastro" component={ClienteCadastro} />
    </BrowserRouter>
  );
}
export default Router;
