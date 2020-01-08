import React, { useState } from 'react';

import UserProfilePicture from './user-profile-picture.component';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';

import './task-assignment.styles.scss';

const TaskAssignment = ({ members, assignee, handleAssignTask, handleUnassignTask }) => {
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);

  const filteredMembers = members.filter(user => {
    if (assignee) {
      return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) && assignee._id !== user._id
    }
    return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  });

  return (
    <div className='task-assignment-container'>
      <div className='task-assignment' onClick={() => setShowAssignmentDropdown(!showAssignmentDropdown)}>
        <AddUserIcon className='add-user-icon add-user-icon-before' title='Assign to' />
        {
          assignee ?
            <div className='member-profile-item'>
              <UserProfilePicture
                backgroundColor={assignee.color}
                initials={assignee.initials}
              />
              <span className='member-profile-item__user-name'>
                {assignee.name}
              </span>
            </div>
            : <span className='assign-button'>Assign</span>
        }
        <AddUserIcon className='add-user-icon add-user-icon-after' title='Assign to' />
      </div>
      {
        showAssignmentDropdown &&
        <TaskAssignmentDropdown
          setShowAssignmentDropdown={setShowAssignmentDropdown}
          memberSearchQuery={memberSearchQuery}
          members={filteredMembers}
          assignee={assignee}
          onInputChange={event => setMemberSearchQuery(event.target.value)}
          removeMember={handleUnassignTask}
          onMemberClick={handleAssignTask}
        />
      }
    </div>
  );
}

export default TaskAssignment;