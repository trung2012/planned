import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import MemberProfileItem from './member-profile-item.component';
import { ReactComponent as RemoveUserIcon } from '../assets/remove-user.svg';
import './board-members-dropdown-list.styles.scss';

const BoardMembersDropdownList = ({ members, removeMember, removeIconText }) => {
  const { highlightMemberTasks } = useContext(BoardContext);

  return (
    <div className='board-members-dropdown-list'>
      {
        members.map(member => (
          <div className='board-members-dropdown-list__item' title={member.name} key={member._id} >
            <MemberProfileItem member={member} onClick={() => highlightMemberTasks(member._id)} />
            <RemoveUserIcon className='remove-user-icon' title={removeIconText} onClick={() => removeMember(member._id)} />
          </div>
        ))
      }
    </div>
  );
}

export default BoardMembersDropdownList;