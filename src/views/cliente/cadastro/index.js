import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import api from '../../../configuration/api';
import Container from '../../../components/card';
import Navbar from '../../../components/navbar';
import * as messages from '../../../components/toastr/toastr';
import * as clienteService from '../../../services/clienteService';
import * as masks from '../../../utils/masks';
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
  const [emails, setEmails] = useState([
    { enderecoEmail: '' },
    { enderecoEmail: '' },
  ]);
  const [telefones, setTelefones] = useState([
    { numeroTelefone: '', tipo: '' },
    { numeroTelefone: '', tipo: '' },
  ]);

  const [idCliente, setIdCliente] = useState(props.match.params.id);
  const idUsuario = useSelector((state) => state.idUsuario);
  const administrador =
    useSelector((state) => state.perfil) === 'ADMINISTRADOR';

  useEffect(() => {
    carregarCliente();
  }, []);

  async function carregarCliente() {
    if (idCliente) {
      const data = await clienteService.buscarPeloId(idCliente);
      setIdCliente(data.id);
      setNome(data.nome);
      setCpf(masks.cpf(data.cpf));
      let telefones = data.telefones;
      telefones.forEach(
        (telefone) =>
          (telefone.numeroTelefone = masks.cellphone(telefone.numeroTelefone))
      );
      setTelefones(telefones);
      setEmails(data.emails);
      setUf(data.endereco.uf);
      setComplemento(data.endereco.complemento);
      setCidade(data.endereco.cidade);
      setLogradouro(data.endereco.logradouro);
      setCep(masks.cep(data.endereco.cep));
      setBairro(data.endereco.bairro);
    }
  }

  async function salvarCliente() {
    const cliente = {
      id: idCliente ? idCliente : null,
      nome: nome,
      cpf: masks.cpfRemove(cpf),
      endereco: {
        cep: masks.cepRemove(cep),
        uf: uf,
        logradouro: logradouro,
        bairro: bairro,
        cidade: cidade,
        complemento: complemento,
      },
      emails: emails.filter((email) => email.enderecoEmail !== ''),
      telefones: telefones
        .filter((telefone) => telefone.numeroTelefone !== '')
        .map((telefone) => {
          return {
            tipo: telefone.tipo,
            numeroTelefone: masks.cellphoneRemove(telefone.numeroTelefone),
          };
        }),
      usuario: { id: idUsuario },
    };

    const validacao = clienteService.validar(cliente);

    if (validacao) {
      api
        .post('/clientes', cliente)

        .then(() => {
          messages.mensagemSucesso('salvo com sucesso!');
          setRedirecionar(true);
        })
        .catch((error) => {
          if (error.response.status === 422) {
            const errors = error.response.data.errors.map(
              (erro) => erro.message
            );
            errors.forEach((erro) => {
              messages.mensagemErro(erro);
            });
            return;
          }
          messages.mensagemErro(error);
        });
    }
  }

  function addEmail() {
    setEmails([...emails, { enderecoEmail: '' }]);
    console.table(emails);
  }

  function handleChangeEmail(value, index, email) {
    let listEmails = emails.map((e, i) => {
      if (i === index) {
        return {
          id: email.id ? email.id : null,
          enderecoEmail: value,
        };
      }
      return e;
    });

    setEmails(listEmails);
    console.table(listEmails);
  }

  function removeEmail(email) {
    setEmails(emails.filter((e) => e !== email));
  }
  function addTelefone() {
    setTelefones([...telefones, { numeroTelefone: '', tipo: '' }]);
  }

  function handleChangeTelefone(telefone, value, index, tipo) {
    let listTelefones = [];
    if (tipo) {
      listTelefones = telefones.map((e, i) => {
        if (i === index) {
          debugger;
          return {
            id: telefone.id ? telefone.id : null,
            numeroTelefone: telefone.numeroTelefone,
            tipo: value,
          };
        }
        return e;
      });
    } else {
      listTelefones = telefones.map((e, i) => {
        if (i === index) {
          return {
            id: telefone.id ? telefone.id : null,
            numeroTelefone: value,
            tipo: telefone.tipo,
          };
        }
        return e;
      });
    }

    setTelefones(listTelefones);
  }

  function removeTelefone(telefone) {
    setTelefones(telefones.filter((e) => e !== telefone));
  }

  async function buscarEnderecoPeloCep(cep) {
    setCep(masks.cep(cep));
    if (cep.length == 9) {
      setLoading(true);

      const endereco = await clienteService.buscarEndereco(
        masks.cepRemove(cep)
      );

      if (endereco && !endereco.uf) {
        messages.mensagemErro('CEP Inválido');
        setLoading(false);
        return;
      }
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
        <div className="row">
          {emails.map((email, index) => {
            return (
              <div className="form-group col-md-6 col-sm-12">
                <label htmlFor={index}>{`Email ${
                  index > 0 ? index + 1 : ' *'
                }`}</label>
                <div className="group-itens">
                  <input
                    type="text"
                    className="form-control"
                    value={email.enderecoEmail}
                    id={index}
                    placeholder="Endereço de email"
                    onChange={(e) =>
                      handleChangeEmail(e.target.value, index, email)
                    }
                  />
                  {index > 0 && administrador && (
                    <button
                      type="button"
                      class="btn btn-danger "
                      onClick={() => removeEmail(email)}
                    >
                      <i class="fas fa-minus-circle"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {administrador && (
          <button
            type="button"
            class="btn btn-primary btn-add"
            onClick={addEmail}
          >
            <i class="fas fa-plus-circle"></i>Email
          </button>
        )}
        <br />
      </>
    );
  }
  function renderTelefones() {
    return (
      <>
        <div className="row">
          {telefones.map((telefone, index) => {
            return (
              <>
                <div className="form-group col-md-3 col-sm-12">
                  <label htmlFor={index}>Tipo</label>
                  <div className="group-itens">
                    <select
                      className="form-control"
                      value={telefone.tipo}
                      onChange={(e) =>
                        handleChangeTelefone(
                          telefone,
                          e.target.value,
                          index,
                          'tipo'
                        )
                      }
                    >
                      <option selected>Selecione...</option>
                      <option value="COMERCIAL">Comercial</option>
                      <option value="RESIDENCIAL">Residencial</option>
                      <option value="CELULAR">Celular</option>
                    </select>
                  </div>
                </div>

                <div className="form-group col-md-3 col-sm-12 ">
                  <label htmlFor={index}>{`Telefone ${
                    index === 0 ? '*' : ''
                  }`}</label>
                  <div className="group-itens">
                    <input
                      type="text"
                      className="form-control"
                      disabled={!telefone.tipo}
                      value={telefone.numeroTelefone}
                      maxLength={telefone.tipo === 'RESIDENCIAL' ? 14 : 15}
                      id={index}
                      placeholder="Numero do telefone"
                      onChange={(e) =>
                        handleChangeTelefone(
                          telefone,
                          masks.cellphone(e.target.value),
                          index
                        )
                      }
                    />
                    {index > 0 && administrador && (
                      <button
                        type="button"
                        class="btn btn-danger col-xs-12 "
                        onClick={() => removeTelefone(telefone)}
                      >
                        <i class="fas fa-minus-circle"></i>
                      </button>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {administrador && (
          <button
            type="button"
            class="btn btn-primary btn-add"
            onClick={addTelefone}
          >
            <i class="fas fa-plus-circle"></i> Telefone
          </button>
        )}

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
            <div className="form-group col-md-7">
              <label htmlFor="inputNome">Nome *</label>
              <input
                type="text"
                autoFocus
                className="form-control"
                id="inputNome"
                value={nome}
                minLength={3}
                maxLength={100}
                placeholder="informe o nome do Cliente"
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-group col-md-3">
              <label htmlFor="inputArtista">Cpf *</label>
              <input
                type="text"
                className="form-control"
                value={cpf}
                id="inputArtista"
                placeholder="Informe o CPF"
                onChange={(e) => setCpf(masks.cpf(e.target.value))}
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="inputNome">CEP *</label>
              <input
                type="text"
                className="form-control"
                id="inputNome"
                value={cep}
                placeholder="informe o CEP"
                onChange={(e) => buscarEnderecoPeloCep(e.target.value)}
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
                <div className="form-group col-md-1">
                  <label htmlFor="inputUf">UF *</label>
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
                  <label htmlFor="inputLogradouro">Logradouro *</label>
                  <input
                    type="text"
                    disabled={!logradouro}
                    className="form-control"
                    value={logradouro}
                    id="inputLogradouro"
                    onChange={(e) => setLogradouro(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="inputBairro">Bairro *</label>
                  <input
                    type="text"
                    disabled={!bairro}
                    className="form-control"
                    value={bairro}
                    id="inputBairro"
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-2">
                  <label htmlFor="inputCidade">Cidade *</label>
                  <input
                    type="text"
                    disabled={!cidade}
                    className="form-control"
                    value={cidade}
                    id="inputCidade"
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="inputComplemento">Complemento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={complemento}
                    id="inputComplemento"
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
          {renderEmails()}
          {renderTelefones()}
          <div className="buttons-group mt-5">
            {administrador && (
              <button
                type="button"
                className="btn btn-secondary mr-2 btn-cadastro"
                onClick={salvarCliente}
              >
                Salvar
              </button>
            )}
            <Link
              className="btn btn-secondary mr-2 btn-cadastro"
              to={'/clientes'}
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
      {!useSelector((state) => state.usuarioLogado) && <Redirect to="/login" />}
      <Navbar />
      <div>
        <Container title="Cadastro de Clientes" content={formCadastro()} />
      </div>
    </>
  );
}
export default CadastroCliente;
