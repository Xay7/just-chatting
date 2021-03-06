import * as actionTypes from '../actions/actionTypes';

const DEFAULT_STATE = {
  isAuthenticated: false,
  errorMessage: '',
  successMessage: '',
  registerSuccess: false,
  username: '',
  user_id: '',
  avatar: '',
  tokenSuccess: false,
};
const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        errorMessage: '',
        registerSuccess: false,
        username: action.username,
        avatar: action.avatar,
        user_id: action.id,
      };
    case actionTypes.AUTH_SIGN_UP:
      return {
        ...state,
        isAuthenticated: false,
        errorMessage: '',
        registerSuccess: true,
      };
    case actionTypes.AUTH_SIGN_IN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        errorMessage: action.payload,
        signInError: true,
        registerSuccess: false,
      };
    case actionTypes.AUTH_SIGN_UP_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        errorMessage: action.payload,
        signUpError: true,
        registerSuccess: false,
      };
    case actionTypes.TOKEN_ACCESS:
      return {
        ...state,
        username: action.username,
        isAuthenticated: true,
        tokenSuccess: true,
      };
    case actionTypes.TOKEN_ERROR:
      return {
        ...state,
        username: '',
        isAuthenticated: false,
        tokenSuccess: false,
      };
    case actionTypes.AUTH_CHANGED_PASSWORD:
      return {
        ...state,
        errorMessage: '',
        successMessage: action.successMessage,
      };
    case actionTypes.AUTH_CHANGED_PASSWORD_ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        successMessage: '',
      };
    case actionTypes.AUTH_CHANGED_AVATAR:
      return {
        ...state,
        avatar: action.avatar,
        errorMessage: '',
        successMessage: '',
      };

    case actionTypes.AUTH_CHANGED_AVATAR_ERROR:
      return {
        ...state,
      };
    case actionTypes.CLEAR_FETCH_MESSAGE:
      return {
        ...state,
        errorMessage: '',
        successMessage: '',
      };
    default:
      return state;
  }
};

export default reducer;
