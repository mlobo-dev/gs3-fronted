import React, { useState } from 'react';

import { mensagemErro } from '../../components/toastr/toastr';
import { useSelector } from 'react-redux';
import './login.css';
import logo from '../../img/gs3.png';
function Login() {
  const [login, setLogin] = useState();
  const [senha, setSenha] = useState();

  return (
    <>
      <div className="login-form col-xs-10 offset-xs-1 col-sm-6 offset-sm-3 col-md-4 offset-md-4 mx-auto">
        <header>
          <h1>
            <img className="img-fluid logo" src={logo} />
          </h1>
          <form>
            <div className="form-group col-md-12">
              <label htmlFor="inputNome">Login</label>
              <input
                type="text"
                className="form-control"
                id="inputNome"
                placeholder="informe o nome do repertório"
              />
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="inputNome">Senha</label>
              <input
                type="password"
                className="form-control"
                id="inputSenha"
                placeholder="informe a senha"
              />
            </div>
            <div className="form-group col-md-12 ">
              <button className="btn btn-primary col-md-12"> Entrar</button>
            </div>
          </form>
        </header>
      </div>
    </>
  );
}

export default Login;
