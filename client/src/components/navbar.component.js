import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from './modal.component'
import UserProfilePicture from './user-profile-picture.component';
import MoreOptions from './more-options.component';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

import { ReactComponent as Logo } from '../assets/logo.svg';
import './navbar.styles.scss';
import UserAccountPage from './user-account-details.component';
import ChangePasswordPage from './change-password-page.component';

const NavBar = () => {
  const history = useHistory();
  const { authState: { user }, signOut, clearAuthErrorMessage } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleSignOut = event => {
    signOut(() => {
      history.push('/');
    });
    socket.close();
    setShowProfileOptions(false);
  }

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar__logo-container'>
        <Logo className='logo' alt='logo' />
        <span className='navbar__logo-text'>Planned</span>
      </Link>
      <div className='navbar__navigation'>
        {
          user &&
          <React.Fragment>
            <div className='navbar__navigation--welcome-message'>
              Welcome, {user.name}
            </div>
            <UserProfilePicture
              backgroundColor={user.color}
              initials={user.initials}
              avatarUrl={user.avatar && user.avatar.url}
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            />
            {
              showProfileOptions &&
              <MoreOptions dismiss={() => setShowProfileOptions(false)}>
                <div
                  className='more-options-item'
                  onClick={() => {
                    setShowProfileOptions(false);
                    setShowAccountDetails(true);
                  }}
                >
                  My account
                </div>
                <div
                  className='more-options-item'
                  onClick={() => {
                    setShowProfileOptions(false);
                    setShowPasswordChange(true);
                  }}
                >
                  Change Password
                </div>
                <div className='more-options-item' onClick={handleSignOut}>Sign out</div>
              </MoreOptions>
            }
          </React.Fragment>
        }
      </div>
      {
        user &&
        showAccountDetails &&
        <Modal
          modalTitle={`${user.name}'s account`}
          dismiss={() => {
            setShowAccountDetails(false)
            clearAuthErrorMessage();
          }}
        >
          <UserAccountPage setShowPasswordChange={setShowPasswordChange} setShowAccountDetails={setShowAccountDetails} />
        </Modal>
      }
      {
        showPasswordChange &&
        <Modal
          modalTitle={'Change password'}
          dismiss={() => {
            setShowPasswordChange(false);
            clearAuthErrorMessage();
          }}
        >
          <ChangePasswordPage setShowPasswordChange={setShowPasswordChange} setShowAccountDetails={setShowAccountDetails} />
        </Modal>
      }
    </nav>
  );
}

export default NavBar;