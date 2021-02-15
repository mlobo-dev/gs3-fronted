import api from '../configuration/api';
import { mensagemErro } from '../components/toastr/toastr';
import * as masks from '../utils/masks';
const BASE_URI = '/clientes';

export async function buscarPeloId(idCliente) {
  return await api
    .get(`${BASE_URI}/${idCliente}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      mensagemErro(error.message);
    });
}
export async function buscarEndereco(cep) {
  return await api
    .get(`/enderecos/${cep}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      mensagemErro(error.message);
    });
}

export async function salvar(cliente) {
  const validacao = validar(cliente);
  if (validacao) {
    return await api
      .post('/clientes', cliente)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        mensagemErro('Não foi possível salvar');
        return error;
      });
  }
}
export async function listarTudo() {
  return await api
    .get(BASE_URI)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      mensagemErro(error.message);
    });
}

export async function deletarPeloId(idCliente) {
  api.delete(`${BASE_URI}/${idCliente}`).catch((error) => {
    mensagemErro(error.message);
  });
}

export function validar(cliente) {
  const erros = [];

  if (!cliente.nome) {
    erros.push('O campo nome é obrigatório');
  }

  if (cliente.nome && (cliente.nome.length < 3 || cliente.nome.length > 100)) {
    erros.push('O nome deve conter entre 3 e 100 caracteres');
  }

  if (!cliente.cpf) {
    erros.push('O campo Cpf é obrigatório');
  }
  if (!cliente.endereco.cep) {
    erros.push('O campo cep é obrigatório');
  }

  if (
    !cliente.emails &&
    cliente.emails.filter((email) => email.enderecoEmail !== '').length < 1
  ) {
    erros.push('Ao menos 1 email deve ser informado');
  }

  if (!cliente.telefones) {
    erros.push('Ao menos 1 telefone deve ser informado');
  }

  if (erros && erros.length > 0) {
    erros.forEach((error) => mensagemErro(error));
    return false;
  }
  return true;
}
