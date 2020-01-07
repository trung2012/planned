import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { ObjectID } from 'bson';
import { useParams } from 'react-router-dom';

import CommentList from './comment-list.component';
import CustomDatePickerSelect from './custom-date-picker-select.component';
import CustomSelect from './custom-select.component';
import UserProfilePicture from './user-profile-picture.component';
import CustomButton from './custom-button.component';
import { ReactComponent as AddUserIcon } from '../assets/add_user.svg';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { progressOptions, priorityOptions } from '../utils/dropdown-options';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';
import './board-task-details.styles.scss';
import CustomDatePicker from './custom-date-picker.component';

const BoardTaskDetails = ({ task, list, dismiss }) => {
  const { projectId } = useParams();
  const { socket } = useContext(SocketContext);
  const { authState } = useContext(AuthContext);
  const {
    boardState,
    assignUserToTask,
    unassignUserFromTask,
    assignTaskToNewList,
    updateTaskAttributes,
    addComment
  } = useContext(BoardContext);

  const { name, description, assignee, progress, priority, due, updatedAt, comments } = task;
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newDueDate, setNewDueDate] = useState(due);
  const [newDescription, setNewDescription] = useState(task.description);

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
    setNewDescription(description);
  }, [description])

  useEffect(() => {
    setNewDueDate(due);
  }, [due])

  const handleAttributeUpdate = data => {
    const updatedTask = {
      taskId: task._id,
      data: {
        ...data,
        updatedAt: Date.now()
      },
      projectId
    }
    socket.emit('update_task_attributes', updatedTask);
    updateTaskAttributes(updatedTask);
  }

  const handleSetNewDueDate = date => {
    setNewDueDate(date);
    handleAttributeUpdate({ due: date });
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

  const handleCommentSubmit = () => {
    const commentData = {
      _id: new ObjectID().toString(),
      text: newCommentText,
      author: authState.user,
      task: task._id,
      project: projectId,
      createdAt: Date.now()
    }

    addComment(commentData);
    setNewCommentText('');
    socket.emit('add_comment', commentData);
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
            <div className='task-last-updated'>{`Updated ${moment(updatedAt).fromNow()}`}</div>
          </div>
          <div className='board-task-details__assignment'>
            <AddUserIcon className='add-user-icon' onClick={() => setShowAssignmentDropdown(true)} />
            {
              assignee ?
                <div className='member-profile-item' onClick={() => setShowAssignmentDropdown(!showAssignmentDropdown)}>
                  <UserProfilePicture
                    backgroundColor={assignee.color}
                    initials={assignee.initials}
                  />
                  <span className='member-profile-item__user-name'>
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
                members={filteredMembers}
                assignee={assignee}
                onInputChange={event => setMemberSearchQuery(event.target.value)}
                removeMember={handleUnassignTask}
                onMemberClick={handleAssignTask}
              />
            }
          </div>
          <div className='board-task-details__dropdowns'>
            <CustomSelect label='List' inputDefault={list} selectOptions={listSelectOptions} submit={handleMoveTaskToNewList} />
            <CustomSelect label='Progress' inputDefault={progress} selectOptions={progressOptions} submit={handleAttributeUpdate} />
            <CustomSelect label='Priority' inputDefault={priority} selectOptions={priorityOptions} submit={handleAttributeUpdate} />
            <CustomDatePicker date={newDueDate} setDate={handleSetNewDueDate}>
              <CustomDatePickerSelect />
            </CustomDatePicker>
          </div>
          <div className='board-task-details__description'>
            <h4>Description</h4>
            <textarea
              name='description-input'
              type='text'
              className='board-task-details__text-input'
              value={newDescription}
              onChange={event => setNewDescription(event.target.value)}
              onBlur={() => {
                if (description !== newDescription) {
                  handleAttributeUpdate({ description: newDescription });
                }
              }}
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
              <CustomButton text='Save' buttonType='save-text' onClick={handleCommentSubmit} />
            </div>
            <CommentList comments={comments} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardTaskDetails;