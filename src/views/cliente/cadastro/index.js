import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import api from '../../../configuration/api';
import Container from '../../../components/card';
import Navbar from '../../../components/navbar';
import * as messages from '../../../components/toastr/toastr';
import * as clienteService from '../../../services/clienteService';
import './cadastro-cliente.css';
import { useSelector } from 'react-redux';

function CadastroCliente(props) {
  const [redirecionar, setRedirecionar] = useState(false);
  const [nome, setNome] = useState();
  const [cpf, setCpf] = useState();
  const [cep, setCep] = useState();
  const [loading, setLoading] = useState(false);
  const [logradouro, setLogradouro] = useState();
  const [complemento, setComplemento] = useState();
  const [bairro, setBairro] = useState();
  const [cidade, setCidade] = useState();
  const [uf, setUf] = useState();
  const [emails, setEmails] = useState([{ enderecoEmail: '' }]);

  const [idCliente, setIdCliente] = useState(props.match.params.id);
  const email = useSelector((state) => state.usuarioEmail);

  useEffect(() => {
    carregarCliente();
  }, []);

  async function carregarCliente() {
    if (idCliente) {
      const data = await clienteService.buscarPeloId(idCliente);
      setIdCliente(data.id);
      setNome(data.nome);
      setCpf(data.cpf);
    }
  }

  function salvar() {
    api
      .post('/Clientes', {
        id: idCliente ? idCliente : null,
        nome: nome,
      })
      .then(() => {
        messages.mensagemSucesso('salvo com sucesso!');
        setRedirecionar(true);
      })
      .catch((error) => {
        messages.mensagemErro(
          'Não foi possível salvar a música: ' + error.message
        );
      });
  }

  function addEmail() {
    setEmails([...emails, { enderecoEmail: '' }]);
    console.table(emails);
  }

  function handleChangeEmail(email, value) {
    email.enderecoEmail = value;
    setEmails([...emails.filter((e) => e !== email), email]);
  }

  function removeEmail(email) {
    setEmails(emails.filter((e) => e !== email));
  }

  async function buscarEnderecoPeloCep(cep) {
    if (cep.length == 8) {
      setLoading(true);
      const endereco = await clienteService.buscarEndereco(cep);
      debugger;
      setCep(cep);
      setUf(endereco.uf);
      setCidade(endereco.cidade);
      setBairro(endereco.bairro);
      setLogradouro(endereco.logradouro);
      setLoading(false);
    }
  }

  function renderEmails() {
    return (
      <>
        {emails.map((email, index) => {
          return (
            <div className="row">
              <div className="form-group col-md-6 col-sm-12">
                <label htmlFor={index}>{`Email ${
                  index > 0 ? index + 1 : ''
                }`}</label>
                <div className="email-group-itens">
                  <input
                    type="text"
                    className="form-control"
                    value={email.enderecoEmail}
                    id={index}
                    placeholder="Endereço de email"
                    onChange={(e) => handleChangeEmail(email, e.target.value)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      class="btn btn-danger col-md-1 col-sm-2 col-xs-1"
                      onClick={() => removeEmail(email)}
                    >
                      <i class="fas fa-minus-circle"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          class="btn btn-primary btn-add-email"
          onClick={addEmail}
        >
          Add Email
        </button>
        <br />
      </>
    );
  }

  function formCadastro() {
    return (
      <>
        {redirecionar && <Redirect to="/Clientes" />}
        <form>
          <div className="row">
            <div className="form-group col-md-9">
              <label htmlFor="inputNome">Nome</label>
              <input
                type="text"
                className="form-control"
                id="inputNome"
                value={nome}
                placeholder="informe o nome do Cliente"
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-group col-md-3">
              <label htmlFor="inputArtista">Cpf</label>
              <input
                type="text"
                className="form-control"
                value={cpf}
                id="inputArtista"
                placeholder="Informe o CPF"
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
          </div>
          <>
            {loading ? (
              <div className="spinner-border text-danger loading" role="status">
                <span className="sr-only ">Loading...</span>
              </div>
            ) : (
              <div className="row">
                <div className="form-group col-md-2">
                  <label htmlFor="inputNome">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNome"
                    value={cep}
                    placeholder="informe o CEP"
                    onChange={(e) => buscarEnderecoPeloCep(e.target.value)}
                  />
                </div>

                <div className="form-group col-md-1">
                  <label htmlFor="inputUf">UF</label>
                  <input
                    type="text"
                    disabled={!uf}
                    maxLength={2}
                    className="form-control"
                    value={uf}
                    id="inputUf"
                    onChange={(e) => setUf(e.target.value)}
                  />
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor="inputUf">Logradouro</label>
                  <input
                    type="text"
                    disabled={!logradouro}
                    className="form-control"
                    value={logradouro}
                    id="inputUf"
                    onChange={(e) => setLogradouro(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="inputUf">Bairro</label>
                  <input
                    type="text"
                    disabled={!bairro}
                    className="form-control"
                    value={bairro}
                    id="inputUf"
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="inputUf">Cidade</label>
                  <input
                    type="text"
                    disabled={!cidade}
                    className="form-control"
                    value={cidade}
                    id="inputUf"
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
              </div>
            )}
          </>

          {emails && renderEmails()}

          <div className="buttons-group">
            <button
              type="button"
              className="btn btn-secondary mr-2 btn-cadastro"
              onClick={salvar}
            >
              Salvar
            </button>

            <Link
              className="btn btn-secondary mr-2 btn-cadastro"
              to={'/repertorios'}
            >
              Voltar
            </Link>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      {!useSelector((state) => state.usuarioLogado) && <Redirect to="/" />}
      <Navbar />
      <div>
        <Container title="Cadastro de Clientes" content={formCadastro()} />
      </div>
    </>
  );
}
export default CadastroCliente;
