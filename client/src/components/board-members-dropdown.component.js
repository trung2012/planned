import React, { useState } from 'react';

import CustomInput from './custom-input.component';
import BoardMembersDropdownItem from './board-members-dropdown-item.component';
import './board-members-dropdown.styles.scss';

const BoardMembersDropdown = ({ members, dismiss }) => {
  const [memberName, setMemberName] = useState('')

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='board-members-dropdown'>
        <h3>Members</h3>
        <CustomInput
          placeholder='Enter name to add a member'
          value={memberName}
          onChange={(event) => setMemberName(event.target.value)}
          autoFocus
        />
        <div className='board-members-dropdown__list'>
          {
            members.map(member => (
              <BoardMembersDropdownItem key={member._id} member={member} />
            ))
          }
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardMembersDropdown;