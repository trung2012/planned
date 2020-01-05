import React, { useState, useContext } from 'react';
import Moment from 'moment';

import DropdownOpener from './dropdown-opener.component';
import UserProfilePicture from './user-profile-picture.component';
import CustomButton from './custom-button.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';

import './board-task-details.styles.scss';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';

const BoardTaskDetails = ({ task, list, dismiss }) => {
  const socket = useContext(SocketContext);
  const { boardState, assignUserToTask } = useContext(BoardContext);
  const { name, description, assignee, progress, priority, due, updatedAt } = task;
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showProgressDropdown, setShowProgressDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const handleChange = event => {

  }

  const handleAssignTask = user => {
    assignUserToTask({ taskId: task._id, user });
    socket.emit('assign_user_to_task', { taskId: task._id, userId: user._id });
  }

  const handleUnassignTask = () => {

  }


  return (
    <React.Fragment>
      <div className='board-task-details-container'>
        <div className='modal__overlay' onClick={dismiss}></div>
        <div className='board-task-details'>
          <span className='modal__close' onClick={dismiss}>
            &times;
          </span>
          <div className='board-task-details__header'>
            <h2>{name}</h2>
            <div className='task-last-updated'>{`Updated ${Moment(updatedAt).fromNow()}`}</div>
          </div>
          <div className='board-task-details__assignment'>
            <AddUserIcon className='add-user-icon' onClick={() => setShowAssignmentDropdown(true)} />
            {
              assignee ?
                <div className='board-members-dropdown-item' onClick={() => setShowAssignmentDropdown(!showAssignmentDropdown)}>
                  <UserProfilePicture
                    backgroundColor={assignee.color}
                    initials={assignee.initials}
                  />
                  <span className='board-members-dropdown-item__user-name'>
                    {assignee.name}
                  </span>
                </div>
                : <span className='board-members-dropdown-item' onClick={() => setShowAssignmentDropdown(!showAssignmentDropdown)}>Assign</span>
            }
            {
              showAssignmentDropdown &&
              <TaskAssignmentDropdown
                memberSearchQuery={memberSearchQuery}
                onInputChange={event => setMemberSearchQuery(event.target.value)}
                removeMember={handleUnassignTask}
                members={boardState.members}
                onMemberClick={handleAssignTask}
              />
            }
          </div>
          <div className='board-task-details__dropdowns'>
            <DropdownOpener label='List' inputDefault={list.name} iconType='dropdown' onClick={() => setShowListDropdown(!showListDropdown)} />
            <DropdownOpener label='Progress' inputDefault={progress} iconType='dropdown' onClick={() => setShowProgressDropdown(!showProgressDropdown)} />
            <DropdownOpener label='Priority' inputDefault={priority} iconType='dropdown' onClick={() => setShowPriorityDropdown(!showPriorityDropdown)} />
            <DropdownOpener label='Due date' inputDefault={due} iconType='calendar' onClick={() => setShowDueDateDropdown(!showDueDateDropdown)} />
          </div>
          <div className='board-task-details__description'>
            <h4>Description</h4>
            <textarea
              name='description-input'
              type='text'
              className='board-task-details__text-input'
              value={description}
              onChange={handleChange}
            />
          </div>
          <div className='board-task-details__attachments'>
            <h4>Attachments</h4>
          </div>
          <div className='board-task-details__comments'>
            <div className='board-task-details__comment-input'>
              <h4>Comments</h4>
              <textarea
                name='comment-input'
                type='text'
                className='board-task-details__text-input'
                value={newCommentText}
                onChange={event => setNewCommentText(event.target.value)}
              />
              <CustomButton text='Save' buttonType='save-text' />
            </div>
            <div>Comments placeholder</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardTaskDetails;