import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import UserProfilePicture from './user-profile-picture.component';
import MoreOptions from './more-options.component';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

import { ReactComponent as Logo } from '../assets/logo.svg';
import './navbar.styles.scss';

const NavBar = () => {
  const history = useHistory();
  const { authState: { user }, signOut } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

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
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            />
            {
              showProfileOptions &&
              <MoreOptions dismiss={() => setShowProfileOptions(false)}>
                <div className='more-options-item'>My account</div>
                <div className='more-options-item'>Change Password</div>
                <div className='more-options-item' onClick={handleSignOut}>Sign out</div>
              </MoreOptions>
            }
          </React.Fragment>
        }
      </div>
    </nav>
  );
}

export default NavBar;