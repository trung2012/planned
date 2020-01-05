import React, { useState } from 'react';

import CustomInput from './custom-input.component';
import BoardMembersDropdownList from './board-members-dropdown-list.component';
import BoardMembersDropdownItem from './board-members-dropdown-item.component'
import MoreOptions from './more-options.component';

import './task-assignment-dropdown.styles.scss';

const TaskAssignmentDropdown = ({ setShowAssignmentDropdown, memberSearchQuery, onInputChange, onMemberClick, assignee, removeMember, members, dismiss }) => {
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleMemberClick = (user) => {
    onMemberClick(user);
    setShowSearchResults(false);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={() => setShowAssignmentDropdown(false)}></div>
      <div className='task-assignment-dropdown'>
        {
          <React.Fragment>
            <h3>Assigned</h3>
            <CustomInput
              placeholder='Enter name to add member'
              value={memberSearchQuery}
              onChange={onInputChange}
              onFocus={() => setShowSearchResults(true)}
            />
            <BoardMembersDropdownList members={assignee ? [assignee] : []} removeMember={removeMember} removeIconText='Remove assignment' />
            {
              showSearchResults &&
              <MoreOptions dismiss={() => setShowSearchResults(false)}>
                {
                  members.length > 0 ? members.map(user => {
                    return (
                      <BoardMembersDropdownItem onClick={() => handleMemberClick(user)} key={user._id} member={user} />
                    );
                  })
                    : <span>No results found</span>
                }
              </MoreOptions>
            }
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );
}

export default TaskAssignmentDropdown;