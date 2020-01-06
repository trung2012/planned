import React, { useState, useContext, useEffect } from 'react';
import Moment from 'moment';
import { useParams } from 'react-router-dom';

import CustomDatePickerSelect from './custom-date-picker-select.component';
import CustomSelect from './custom-select.component';
import UserProfilePicture from './user-profile-picture.component';
import CustomButton from './custom-button.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import { progressOptions, priorityOptions } from '../utils/dropdown-options';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';
import './board-task-details.styles.scss';
import CustomDatePicker from './custom-date-picker.component';

const BoardTaskDetails = ({ task, list, dismiss }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const { boardState, assignUserToTask, unassignUserFromTask, assignTaskToNewList } = useContext(BoardContext);

  const { name, description, assignee, progress, priority, due, updatedAt } = task;
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newDueDate, setNewDueDate] = useState(due);

  const listSelectOptions = boardState.currentProject.lists.map(listId => {
    return boardState.lists[listId];
  })

  const filteredMembers = boardState.members.filter(user => {
    if (assignee) {
      return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) && assignee._id !== user._id
    }
    return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  });

  useEffect(() => {
    // updateTaskDueDate({ taskId: task._id, due: newDueDate });
  }, [newDueDate])

  const handleChange = () => {

  }

  const handleAssignTask = user => {
    const updatedAt = Date.now();
    assignUserToTask({ taskId: task._id, user, updatedAt });
    socket.emit('assign_user_to_task', {
      taskId: task._id,
      user,
      projectId,
      updatedAt
    });
  }

  const handleUnassignTask = () => {
    unassignUserFromTask({ taskId: task._id });
    socket.emit('unassign_task', { taskId: task._id, projectId });
  }

  const handleMoveTaskToNewList = (newListId) => {
    if (newListId !== list._id) {
      const data = {
        task,
        oldListId: list._id,
        newListId,
        updatedAt: Date.now()
      };
      assignTaskToNewList(data);
      socket.emit('assign_task_to_new_list', { data, projectId });
    }
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
                : <span className='assign-button' onClick={() => setShowAssignmentDropdown(!showAssignmentDropdown)}>Assign</span>
            }
            {
              showAssignmentDropdown &&
              <TaskAssignmentDropdown
                setShowAssignmentDropdown={setShowAssignmentDropdown}
                memberSearchQuery={memberSearchQuery}
                onInputChange={event => setMemberSearchQuery(event.target.value)}
                removeMember={handleUnassignTask}
                members={filteredMembers}
                onMemberClick={handleAssignTask}
                assignee={assignee}
              />
            }
          </div>
          <div className='board-task-details__dropdowns'>
            <CustomSelect label='List' inputDefault={list} selectOptions={listSelectOptions} submit={handleMoveTaskToNewList} />
            <CustomSelect label='Progress' inputDefault={progress} selectOptions={progressOptions} />
            <CustomSelect label='Priority' inputDefault={priority} selectOptions={priorityOptions} />
            <CustomDatePicker date={newDueDate} setDate={setNewDueDate}>
              <CustomDatePickerSelect />
            </CustomDatePicker>
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