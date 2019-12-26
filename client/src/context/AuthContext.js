import createDataContext from './createDataContext';
import axios from 'axios';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'load_user':
      return { ...state, token: action.payload.token, user: action.payload.user, errorMessage: null }
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'signin':
      return { errorMessage: null, token: action.payload.token, user: action.payload.user };
    case 'clear_error_message':
      return { ...state, errorMessage: null };
    case 'signout':
      return { token: null, errorMessage: null, user: null };
    default:
      return state;
  }
};

const loadUser = dispatch => async (callback) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const requestConfig = {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }
      const response = await axios.get('/api/users', requestConfig);
      dispatch({ type: 'load_user', payload: { token, user: response.data.user } });
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch({ type: 'add_error', payload: err.response.data });
    }
  }
}

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

const signUp = dispatch => async ({ displayName, email, password }) => {
  try {
    const response = await axios.post('/api/users', { name: displayName, email, password });
    localStorage.setItem('token', response.data.token);
    dispatch({ type: 'signin', payload: { token: response.data.token, user: response.data.user } });
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err.response.data
    });
  }
};

const signIn = dispatch => async ({ email, password }, callback) => {
  try {
    const response = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', response.data.token);
    dispatch({ type: 'signin', payload: { token: response.data.token, user: response.data.user } });
    if (callback) {
      callback();
    }
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: err.response.data
    });
  }
};

const signOut = dispatch => async (callback) => {
  localStorage.removeItem('token');
  dispatch({ type: 'signout' });
  if (callback) {
    callback();
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signIn, signOut, signUp, clearErrorMessage, loadUser },
  { token: localStorage.getItem('token'), errorMessage: null, user: null }
);