import React, { useState } from 'react';
import Moment from 'moment';

import DropdownOpener from './dropdown-opener.component';
import UserProfilePicture from './user-profile-picture.component';
import CustomButton from './custom-button.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';

import './board-task-details.styles.scss';

const BoardTaskDetails = ({ task, dismiss }) => {
  const { name, description, assignee, list, progress, priority, due, createdAt, updatedAt } = task;
  const [currentTask, setCurrentTask] = useState(task);
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showProgressDropdown, setShowProgressDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const handleChange = event => {

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
            <AddUserIcon className='add-user-icon' />
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
                : <span className='board-members-dropdown-item'>Assign</span>
            }
          </div>
          <div className='board-task-details__dropdowns'>
            <DropdownOpener label='List' inputDefault={list.name} iconType='dropdown' onClick={() => setShowListDropdown(!showListDropdown)} />
            <DropdownOpener label='Progress' inputDefault={progress} iconType='dropdown' onClick={() => setShowProgressDropdown(!showProgressDropdown)} />
            <DropdownOpener label='Priority' inputDefault={priority} iconType='dropdown' onClick={() => setShowPriorityDropdown(!showPriorityDropdown)} />
            <DropdownOpener label='Due date' inputDefault={due} iconType='calendar' onClick={() => setShowDueDateDropdown(!showDueDateDropdown)} />
          </div>
          <div className='board-task-details__description'>
            <form>
              <textarea
                name='description-input'
                type='text'
                className='board-task-details__description__input'
                value={currentTask.description}
                onChange={handleChange}
              />
            </form>
          </div>
          <div className='board-task-details__attachments'>
            Attachments
          </div>
          <div className='board-task-details__comments'>
            <textarea
              name='comment-input'
              type='text'
              className='board-task-details__comments__input'
              value={newCommentText}
              onChange={event => setNewCommentText(event.target.value)}
            />
            <CustomButton text='Add comment' buttonType='add-comment' />
            <div>Comments placeholder</div>
            <div></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardTaskDetails;