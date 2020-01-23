import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';

import FormInput from './form-input.component';
import CustomButton from './custom-button.component';
import ErrorDisplay from './error-display.component';
import { SocketContext } from '../context/SocketContext';
import reconnectSocket from '../utils/reconnectSocket';

import './signin.styles.scss';

const SignIn = () => {
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { socket } = useContext(SocketContext);
  const { authState, signIn, clearAuthErrorMessage } = useContext(AuthContext);

  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' })
  const { email, password } = userCredentials;

  const handleChange = event => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value })
  }

  const handleSubmit = event => {
    event.preventDefault();
    signIn({ email, password }, () => {
      reconnectSocket(socket);
      history.replace(from);
    });
  }

  const handleSubmitGuest = () => {
    signIn({ email: 'guest@example.com', password: 'planned_guest' }, () => {
      reconnectSocket(socket);
      history.replace(from);
    });
  }

  const clearError = () => {
    if (authState.errorMessage) {
      clearAuthErrorMessage();
    }
  }

  return (
    <div className='sign-in-page'>
      <div className='content-container'>
        <h1 className='sign-in-title'>Sign in</h1>
        {
          authState.errorMessage && <ErrorDisplay text={authState.errorMessage} />
        }
        <form className='sign-in-form' onSubmit={handleSubmit}>
          <FormInput
            name='email'
            type='email'
            value={email}
            required
            handleChange={handleChange}
            label='email'
            onFocus={clearError}
          />
          <FormInput
            name='password'
            type='password'
            value={password}
            required
            handleChange={handleChange}
            label='password'
            onFocus={clearError}
          />
          <div className='buttons-container'>
            <CustomButton text='Sign in' />
          </div>
          <div className='more-auth-options'>
            <span className='no-account'>Don't have an account?</span>
            <span
              className='register-link'
              onClick={() => {
                history.push('/signup');
                clearError()
              }
              }
            >
              Register Now
              </span>
          </div>
          <div className='more-auth-options'>
            <span
              className='register-link'
              onClick={handleSubmitGuest}
            >
              Log in as Guest
              </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;