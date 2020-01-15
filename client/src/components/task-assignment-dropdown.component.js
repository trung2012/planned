import React, { useState } from 'react';

import CustomInput from './custom-input.component';
import BoardMembersDropdownList from './board-members-dropdown-list.component';
import MemberProfileItem from './member-profile-item.component'
import MoreOptions from './more-options.component';

import './task-assignment-dropdown.styles.scss';

const TaskAssignmentDropdown = ({ dismiss, onMemberClick, assignee, removeMember, members }) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const filteredMembers = members.filter(user => {
    if (assignee) {
      return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) && assignee._id !== user._id
    }
    return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  });

  const handleMemberClick = (user) => {
    onMemberClick(user);
    setShowSearchResults(false);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='task-assignment-dropdown'>
        <div className='task-assignment-dropdown__header'>
          <h3>Assigned</h3>
          <CustomInput
            placeholder='Enter name to add member'
            value={memberSearchQuery}
            onChange={(event) => {
              setMemberSearchQuery(event.target.value);
              if (!showSearchResults) {
                setShowSearchResults(true);
              }
            }}
            onFocus={() => setShowSearchResults(true)}
          />
        </div>
        <BoardMembersDropdownList members={assignee ? [assignee] : []} removeMember={removeMember} removeIconText='Remove assignment' />
        {
          showSearchResults &&
          <MoreOptions className='member-search-result' dismiss={() => setShowSearchResults(false)}>
            {
              filteredMembers.length > 0 ? filteredMembers.map(user => {
                return (
                  <MemberProfileItem onClick={() => handleMemberClick(user)} key={user._id} member={user} />
                );
              })
                : <span className='no-results'>No results found</span>
            }
          </MoreOptions>
        }
      </div>
    </React.Fragment>
  );
}

export default TaskAssignmentDropdown;