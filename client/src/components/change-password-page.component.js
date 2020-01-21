import React, { useContext, useState } from 'react';

import { AuthContext } from '../context/AuthContext';
import ErrorDisplay from './error-display.component';
import CustomInput from './custom-input.component';
import CustomButton from './custom-button.component';

import './change-password-page.styles.scss';

const ChangePasswordPage = ({ setShowPasswordChange }) => {
  const { authState, changePassword, clearAuthErrorMessage } = useContext(AuthContext);
  const [userCredentials, setUserCredentials] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' })
  const { oldPassword, newPassword, confirmNewPassword } = userCredentials;
  const [passwordError, setPasswordError] = useState(null);

  const handleChange = event => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value })
  }

  const handleSubmit = event => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return setPasswordError('Please fill out all required fields')
    }

    if (newPassword !== confirmNewPassword) {
      return setPasswordError('Passwords do not match. Please try again!');
    }
    if (newPassword.length < 8) {
      return setPasswordError('Passwords need to be at least 8 characters long');
    }

    changePassword({ oldPassword, newPassword, confirmNewPassword }, () => {
      alert('Password changed successfully');
      setShowPasswordChange(false);
    });
  }

  const dismiss = () => {
    setShowPasswordChange(false);
    setPasswordError(null);
    clearAuthErrorMessage()
  }

  return (
    <form className='change-password' onSubmit={handleSubmit}>
      {
        (authState.errorMessage || passwordError)
        && <ErrorDisplay text={authState.errorMessage || passwordError} />
      }
      <div className='change-password__form-inputs'>
        <div className='change-password__label'>Old password</div>
        <CustomInput
          name='oldPassword'
          type='password'
          value={oldPassword}
          required
          autoFocus
          onChange={handleChange}
          onFocus={() => setPasswordError(null)}
        />
        <div className='change-password__label'>New password</div>
        <CustomInput
          name='newPassword'
          type='password'
          value={newPassword}
          required
          onChange={handleChange}
          onFocus={() => setPasswordError(null)}
        />
        <div className='change-password__label'>Confirm new password</div>
        <CustomInput
          name='confirmNewPassword'
          type='password'
          value={confirmNewPassword}
          required
          onChange={handleChange}
          onFocus={() => setPasswordError(null)}
        />
      </div>
      <div className='change-password__buttons'>
        <CustomButton text='Confirm' onClick={handleSubmit} />
        <CustomButton
          type='button'
          text='Cancel'
          onClick={dismiss}
        />
      </div>
    </form>
  );
}

export default ChangePasswordPage;