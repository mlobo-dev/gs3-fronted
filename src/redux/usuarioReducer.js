const INITIAL_STATE = {
  idUsuario: 1,
  perfil: null,
  usuarioLogado: false,
};

function usuarioReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        usuarioLogado: true,
        idUsuario: action.idUsuario,
        perfil: action.perfil,
      };
    case 'LOG_OUT':
      return {
        ...state,
        idUsuario: null,
        perfil: null,
        usuarioLogado: false,
      };
    default:
      return state;
  }
}

export default usuarioReducer;
