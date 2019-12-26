import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'load_user':
      return { ...state, token: action.payload.token, user: action.payload.user, errorMessage: null }
    case 'add_auth_error':
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

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    token: localStorage.getItem('token'),
    errorMessage: null,
    user: null
  });

  const loadUser = useCallback(async (callback) => {
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
        dispatch({ type: 'add_auth_error', payload: err.response.data });
      }
    }
  }, [])

  const clearErrorMessage = () => {
    dispatch({ type: 'clear_error_message' });
  };

  const signUp = async ({ displayName, email, password }, callback) => {
    try {
      const response = await axios.post('/api/users', { name: displayName, email, password });

      localStorage.setItem('token', response.data.token);

      dispatch({ type: 'signin', payload: { token: response.data.token, user: response.data.user } });
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch({
        type: 'add_auth_error',
        payload: err.response.data
      });
    }
  };

  const signIn = async ({ email, password }, callback) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'signin', payload: { token: response.data.token, user: response.data.user } });
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch({
        type: 'add_auth_error',
        payload: err.response.data
      });
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    dispatch({ type: 'signout' });
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut, signUp, clearErrorMessage, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};