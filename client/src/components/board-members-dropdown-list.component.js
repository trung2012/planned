import React from 'react';

import MemberProfileItem from './member-profile-item.component';
import { ReactComponent as RemoveUserIcon } from '../assets/remove-user.svg';
import './board-members-dropdown-list.styles.scss';

const BoardMembersDropdownList = ({ members, removeMember, removeIconText }) => {
  return (
    <React.Fragment>
      <div className='board-members-dropdown-list'>
        {
          members.map(member => (
            <div className='board-members-dropdown-list__item' title={member.name} key={member._id}>
              <MemberProfileItem member={member} />
              <RemoveUserIcon className='remove-user-icon' title={removeIconText} onClick={() => removeMember(member._id)} />
            </div>
          ))
        }
      </div>
    </React.Fragment>
  );
}

export default BoardMembersDropdownList;