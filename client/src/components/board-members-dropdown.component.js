import React from 'react';

import BoardMembersDropdownItem from './board-members-dropdown-item.component';
import './board-members-dropdown.styles.scss';

const BoardMembersDropdown = ({ members, dismiss }) => {
  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='board-members-dropdown'>
        <h3>Members</h3>
        <div className='board-members-dropdown-list'>
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