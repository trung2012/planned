import React from 'react';

import CustomInput from './custom-input.component';
import BoardMembersDropdownList from './board-members-dropdown-list.component';
import BoardMembersDropdownItem from './board-members-dropdown-item.component'
import MoreOptions from './more-options.component';

import './task-assignment-dropdown.styles.scss';

const TaskAssignmentDropdown = ({ memberSearchQuery, onInputChange, onMemberClick, assignee, removeMember, members }) => {
  return (
    <div className='task-assignment-dropdown'>
      <CustomInput
        placeholder='Enter name to add member'
        value={memberSearchQuery}
        onChange={onInputChange}
        autoFocus
      />
      <BoardMembersDropdownList members={assignee ? [assignee] : []} removeMember={removeMember} />
      {
        <MoreOptions dismiss={() => { }}>
          {
            members.length > 0 ? members
              .filter(user => user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()))
              .map(user => {
                return (
                  <BoardMembersDropdownItem onClick={() => onMemberClick(user)} key={user._id} member={user} />
                );
              })
              : <span>No results found</span>
          }
        </MoreOptions>
      }
    </div>
  );
}

export default TaskAssignmentDropdown;