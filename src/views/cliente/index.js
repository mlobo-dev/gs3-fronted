import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Container from '../../components/card';
import Navbar from '../../components/navbar';
import { mensagemSucesso } from '../../components/toastr/toastr';
import * as clienteService from '../../services/clienteService';
import * as masks from '../../utils/masks';
import { useSelector } from 'react-redux';
import './cliente.css';

function Cliente() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clienteDeletar, setClienteDeletar] = useState();
  const perfil = useSelector((state) => state.perfil);

  async function listarClientes() {
    setLoading(true);
    const results = await clienteService.listarTudo();
    setTimeout(() => {
      setClientes(results);
      setLoading(false);
    }, 1000);
  }

  async function buscarPeloId(idCliente) {
    setClienteDeletar(await clienteService.buscarPeloId(idCliente));
  }

  async function deletar() {
    clienteService.deletarPeloId(clienteDeletar.id);
    setClientes(clientes.filter((cliente) => cliente.id !== clienteDeletar.id));
    mensagemSucesso('Cliente deletado com sucesso!');
  }

  function renderTable() {
    return (
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr key={0}>
            <th scope="col" className="text-center">
              #
            </th>
            <th scope="col">Nome</th>
            <th scope="col">Cpf</th>
            <th scope="col">Cidade</th>
            <th scope="col">UF</th>
            <th scope="col" className="text-center">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            return (
              <>
                <tr key={cliente.id}>
                  <th className="text-center" scope="row" name="idColumn">
                    {cliente.id}
                  </th>
                  <td>{cliente.nome}</td>
                  <td>{masks.cpf(cliente.cpf)}</td>
                  <td>{cliente.endereco.cidade}</td>
                  <td>{cliente.endereco.uf}</td>
                  <td className="action-itens">
                    {perfil !== 'ADMINISTRADOR' && (
                      <Link to={`clientes/cadastro/${cliente.id}`}>
                        <i className="fas fa-eye"></i>
                      </Link>
                    )}

                    {perfil === 'ADMINISTRADOR' && (
                      <>
                        <Link to={`clientes/cadastro/${cliente.id}`}>
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <Link>
                          <i
                            id={cliente.id}
                            onClick={(e) => buscarPeloId(e.target.id)}
                            data-toggle="modal"
                            data-target="#exampleModal"
                            className="fas fa-trash"
                          ></i>
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    );
  }

  useEffect(() => {
    listarClientes();
  }, []);

  function tabelaMusica() {
    return (
      <>
        {loading ? (
          <div className="spinner-border text-danger loading" role="status">
            <span className="sr-only ">Loading...</span>
          </div>
        ) : (
          renderTable()
        )}
      </>
    );
  }

  function menuContainer() {
    return (
      <>
        <button type="button" className="btn btn-secondary mr-2 btn-cadastro">
          <Link className="text-white " to="/clientes/cadastro">
            Adicionar
          </Link>
        </button>
      </>
    );
  }
  return (
    <>
      {!useSelector((state) => state.usuarioLogado) && <Redirect to="/login" />}
      <Navbar />

      <Container
        title="Clientes"
        menu={perfil === 'ADMINISTRADOR' && menuContainer()}
        content={tabelaMusica()}
      />

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Confirmação de Exclusão
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {clienteDeletar &&
                `Realmente deseja excluir cliente ${clienteDeletar.nome}? essa ação não poderá ser revertida.`}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                data-dismiss="modal"
                className="btn btn-danger"
                onClick={() => deletar()}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Cliente;
