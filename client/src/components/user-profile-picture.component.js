import React from 'react';

import './user-profile-picture.styles.scss';

const UserProfilePicture = ({ backgroundColor, initials, name, onClick, avatarUrl }) => {
  return (
    avatarUrl ?
      <div
        className='user-profile-picture'
        onClick={onClick}
        title={name}
      >
        <img src={avatarUrl} alt='avatar' className='user-avatar' />
      </div>
      : <div
        className='user-profile-picture'
        style={{ backgroundColor }}
        onClick={onClick}
        title={name}
      >
        {initials}
      </div>
  );
}

export default UserProfilePicture;