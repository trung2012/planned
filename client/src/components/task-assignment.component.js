import React, { useState } from 'react';

import UserProfilePicture from './user-profile-picture.component';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';

import './task-assignment.styles.scss';

const TaskAssignment = ({ members, assignee, handleAssignTask, handleUnassignTask }) => {
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);

  const handleTaskAssignmentClick = event => {
    event.stopPropagation();
    setShowAssignmentDropdown(!showAssignmentDropdown);
  }

  return (
    <div className='task-assignment-container'>
      <div className='task-assignment' onClick={handleTaskAssignmentClick} title='Assign to'>
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
        <AddUserIcon className='add-user-icon add-user-icon-after' />
      </div>
      {
        showAssignmentDropdown &&
        <TaskAssignmentDropdown
          dismiss={() => setShowAssignmentDropdown(false)}
          members={members}
          assignee={assignee}
          removeMember={handleUnassignTask}
          onMemberClick={handleAssignTask}
        />
      }
    </div>
  );
}

export default TaskAssignment;