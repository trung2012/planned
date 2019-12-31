import React from 'react';

import './user-profile-picture.styles.scss';

const UserProfilePicture = ({ backgroundColor, initials, name, onClick }) => {
  return (
    <div
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