import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';

import FormInput from './form-input.component';
import CustomButton from './custom-button.component';
import ErrorDisplay from './error-display.component';

import './signin.styles.scss';

const SignIn = () => {
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { authState, signIn, clearAuthErrorMessage } = useContext(AuthContext);

  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' })
  const { email, password } = userCredentials;

  const handleChange = event => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value })
  }

  const handleSubmit = event => {
    event.preventDefault();
    signIn({ email, password }, () => history.replace(from));
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
            onFocus={() => clearAuthErrorMessage()}
          />
          <FormInput
            name='password'
            type='password'
            value={password}
            required
            handleChange={handleChange}
            label='password'
            onFocus={() => clearAuthErrorMessage()}
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
                clearAuthErrorMessage();
              }
              }
            >
              Register Now
              </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;