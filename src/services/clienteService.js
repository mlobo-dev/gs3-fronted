import api from '../configuration/api';
import { mensagemErro } from '../components/toastr/toastr';
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
