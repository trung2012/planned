import React from 'react';

import UserProfilePicture from './user-profile-picture.component';

import './member-profile-item.styles.scss';

const MemberProfileItem = ({ member, onClick }) => {
  return (
    <div className='member-profile-item' onClick={onClick}>
      <UserProfilePicture
        backgroundColor={member.color}
        initials={member.initials}
      />
      <span className='member-profile-item__user-name'>
        {member.name}
      </span>
    </div>
  );
}

export default MemberProfileItem;