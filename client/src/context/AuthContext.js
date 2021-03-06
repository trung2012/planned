import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { generateRequestConfig } from '../utils/helper';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'load_user':
      return { ...state, token: action.payload.token, user: action.payload.user, errorMessage: null }
    case 'add_auth_error':
      return { ...state, errorMessage: action.payload };
    case 'signin':
      return { ...state, errorMessage: null, token: action.payload.token, user: action.payload.user };
    case 'set_user_profile_pic':
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload.avatar
        }
      }
    case 'clear_auth_error_message':
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

  const loadUser = useCallback(async (redirectToSignIn) => {
    const requestConfig = generateRequestConfig();
    if (requestConfig) {
      try {
        const response = await axios.get('/api/users', requestConfig);
        dispatch({ type: 'load_user', payload: { token: response.data.token, user: response.data.user } });
      } catch (err) {
        redirectToSignIn();
      }
    }
  }, [])

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
      console.log(err)
      dispatch({
        type: 'add_auth_error',
        payload: err.response.data
      });
    }
  };

  const signOut = (callback) => {
    localStorage.removeItem('token');
    dispatch({ type: 'signout' });
    if (callback) {
      callback();
    }
  };

  const setUserProfilePicture = user => {
    dispatch({ type: 'set_user_profile_pic', payload: user });
  }

  const changePassword = async (passwordData, callback) => {
    const requestConfig = generateRequestConfig();

    if (requestConfig) {
      try {
        await axios.put('/api/users/password', JSON.stringify(passwordData), requestConfig);

        if (callback) {
          callback();
        }

      } catch (err) {
        addAuthError(err.response.data);
      }
    }
  }

  const addAuthError = (errorMessage) => {
    dispatch({ type: 'add_auth_error', payload: errorMessage });
  }

  const clearAuthErrorMessage = useCallback(() => {
    dispatch({ type: 'clear_auth_error_message' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signOut,
        signUp,
        addAuthError,
        clearAuthErrorMessage,
        loadUser,
        setUserProfilePicture,
        changePassword
      }}>
      {children}
    </AuthContext.Provider>
  );
};