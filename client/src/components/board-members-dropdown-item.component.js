import React from 'react';

import UserProfilePicture from './user-profile-picture.component';

import './board-members-dropdown-item.styles.scss';

const BoardMembersDropdownItem = ({ member }) => {
  return (
    <div className='board-members-dropdown-item'>
      <UserProfilePicture
        backgroundColor={member.color}
        initials={member.initials}
      />
      <span className='board-members-dropdown-item__user-name'>
        {member.name}
      </span>
    </div>
  );
}

export default BoardMembersDropdownItem;