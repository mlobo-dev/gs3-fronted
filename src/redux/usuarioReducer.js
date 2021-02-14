const INITIAL_STATE = {
  usuarioEmail: 'mlobo.dev@gmail.com',
  usuarioLogado: true,
};

function usuarioReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        usuarioLogado: true,
        usuarioEmail: action.usuarioEmail,
      };
    case 'LOG_OUT':
      return {
        ...state,
        usuarioLogado: false,
        usuarioEmail: '',
      };
    default:
      return state;
  }
}

export default usuarioReducer;
