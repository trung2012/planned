import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { ObjectID } from 'bson';

import MemberProfileItem from './member-profile-item.component';
import NameChangeForm from './name-change-form.component';
import CommentList from './comment-list.component';
import CustomDatePickerSelect from './custom-date-picker-select.component';
import CustomSelect from './custom-select.component';
import CustomButton from './custom-button.component';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { progressOptions, priorityOptions } from '../utils/dropdownOptions';
import CustomDatePicker from './custom-date-picker.component';
import TaskAssignment from './task-assignment.component';
import { handleTaskAssignment, handleTaskUpdate } from '../utils/updateTasks';
import FileUpload from './file-upload.component';
import TaskAttachmentList from './task-attachment-list.component';
import getSelectIcon from '../utils/getSelectIcon';
import { MyTasksContext } from '../context/MyTasksContext';

import './board-task-details.styles.scss';

const BoardTaskDetails = ({ task, list, listSelectOptions, dismiss, isViewingMyTasks }) => {
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

  const {
    updateTaskInMyTasks,
    deleteTaskFromMyTasks,
    addCommentMyTasks,
    toggleTaskCompletionMyTasks
  } = useContext(MyTasksContext);

  const { _id, name, description, assignee, progress, priority, due, updatedAt, comments, createdBy, attachments, project } = task;
  const [showTaskNameEdit, setShowTaskNameEdit] = useState(false);
  const [showTaskDescriptionEdit, setShowTaskDescriptionEdit] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newDueDate, setNewDueDate] = useState(due);
  const [newDescription, setNewDescription] = useState(description);

  useEffect(() => {
    setNewDescription(description);
  }, [description])

  useEffect(() => {
    setNewDueDate(due);
  }, [due])

  const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, _id, project, { assignUserToTask, unassignUserFromTask });

  const { handleAttributeUpdate, handleCompletionToggle } = handleTaskUpdate(socket, _id, project, { updateTaskAttributes })

  const updateTask = updatedData => {
    const newTask = {
      ...updatedData,
      updatedAt: Date.now(),
      updatedBy: authState.user
    }
    if (isViewingMyTasks) {
      updateTaskInMyTasks({
        taskId: _id,
        listId: progress,
        data: { ...newTask }
      });
    }

    handleAttributeUpdate(updatedData);
  }

  const handleTaskAssignmentRemove = () => {
    if (isViewingMyTasks) {
      deleteTaskFromMyTasks({ taskId: _id, listId: progress });
    }

    handleUnassignTask();
  }

  const handleSetNewDueDate = date => {
    setNewDueDate(date);

    updateTask({ due: date });
  }

  const handleMoveTaskToNewList = (newListId) => {
    if (newListId !== list._id) {
      const data = {
        task,
        oldListId: list._id,
        newListId,
        updatedAt: Date.now(),
        updatedBy: authState.user
      };

      if (isViewingMyTasks) {
        updateTask({ list: newListId });
      } else {
        assignTaskToNewList(data);
      }

      socket.emit('assign_task_to_new_list', { data, projectId: task.project });
    }
  }

  const handleCommentSubmit = () => {
    if (newCommentText === '') {
      return;
    }

    const commentData = {
      _id: new ObjectID().toString(),
      text: newCommentText,
      author: authState.user,
      task: _id,
      project: project,
      createdAt: Date.now()
    }

    if (isViewingMyTasks) {
      addCommentMyTasks(commentData);
    } else {
      addComment(commentData);
    }

    setNewCommentText('');
    socket.emit('add_comment', commentData);
  }

  const handleTaskEditName = taskName => {
    if (name !== taskName) {
      updateTask({ name: taskName })
    }
    setShowTaskNameEdit(false);
  }

  const handleSetComplete = event => {
    event.stopPropagation();

    const newTask = {
      ...task,
      updatedAt: Date.now()
    }

    if (isViewingMyTasks) {
      if (progress === 'Completed') {
        toggleTaskCompletionMyTasks({
          listId: task.progress,
          newTask: {
            ...newTask,
            progress: 'Not started',
            completedBy: null
          }
        });
      } else {
        toggleTaskCompletionMyTasks({
          listId: task.progress,
          newTask: {
            ...newTask,
            progress: 'Completed',
            completedBy: authState.user
          }
        });
      }
    }

    handleCompletionToggle(progress);

    if (progress === 'Completed') {
      handleAttributeUpdate({ completedBy: null });
    } else {
      handleAttributeUpdate({ completedBy: authState.user });
    }
  }

  return (
    <div className='board-task-details-container'>
      <div className='modal__overlay' onClick={dismiss}></div>
      <div className='board-task-details'>
        <span className='modal__close' onClick={dismiss}>
          &times;
          </span>
        <div className='board-task-details__header'>
          <div className='board-task-details__name'>
            <span onClick={handleSetComplete}>
              {
                (progress === 'In progress')
                  ? getSelectIcon('Not started')
                  : getSelectIcon(progress)
              }
            </span>
            {
              showTaskNameEdit ?
                <NameChangeForm name={name} submit={handleTaskEditName} dismiss={() => setShowTaskNameEdit(false)} type='task' />
                : <h2 onClick={() => setShowTaskNameEdit(true)}>{name}</h2>
            }
          </div>
          <div className='task-last-updated'>{`Updated ${moment(updatedAt).fromNow()}`}</div>
        </div>
        <div className='board-task-details__assignment'>
          <TaskAssignment
            assignee={assignee}
            members={boardState.members}
            handleAssignTask={handleAssignTask}
            handleUnassignTask={handleTaskAssignmentRemove}
          />
        </div>
        <div className='board-task-details__dropdowns'>
          <CustomSelect label='List' inputDefault={list} selectOptions={listSelectOptions} submit={handleMoveTaskToNewList} />
          <CustomSelect label='Progress' inputDefault={progress} selectOptions={progressOptions} submit={updateTask} />
          <CustomSelect label='Priority' inputDefault={priority} selectOptions={priorityOptions} submit={updateTask} />
          <CustomDatePicker date={Date.parse(newDueDate)} setDate={handleSetNewDueDate}>
            <CustomDatePickerSelect style={{ width: '22rem' }} />
          </CustomDatePicker>
        </div>
        <div className='board-task-details__description'>
          <h4>Description</h4>
          {
            showTaskDescriptionEdit
              ? <textarea
                placeholder='Add a description or notes'
                name='description-input'
                type='text'
                className='board-task-details__text-input'
                autoFocus
                value={newDescription}
                onChange={event => setNewDescription(event.target.value)}
                onFocus={event => {
                  let temp = event.target.value;
                  event.target.value = ''
                  event.target.value = temp;
                }}
                onBlur={() => {
                  if (description !== newDescription) {
                    updateTask({ description: newDescription });
                  }
                  setShowTaskDescriptionEdit(false);
                }}
              />
              : <pre className='board-task-details__text-input' onClick={() => setShowTaskDescriptionEdit(true)}>
                {newDescription || <span className='description-placeholder'>Add a description or notes</span>}
              </pre>
          }

        </div>
        <div className='board-task-details__attachments'>
          <h4>Attachments</h4>
          <FileUpload url={`/api/files/upload/${task.project}/${_id}`} text='Add attachment' isViewingMyTasks={isViewingMyTasks} />
          <TaskAttachmentList attachments={attachments} isViewingMyTasks={isViewingMyTasks} />
        </div>
        <div className='board-task-details__comments'>
          <div className='board-task-details__comment-input'>
            <h4>Comments</h4>
            <textarea
              placeholder='Type your message here'
              name='comment-input'
              type='text'
              className='board-task-details__text-input'
              value={newCommentText}
              onChange={event => setNewCommentText(event.target.value)}
            />
            <CustomButton text='Save' buttonType='save-text' onClick={handleCommentSubmit} disabled={newCommentText === ''} />
          </div>
          <CommentList comments={comments} />
          <div className='comment'>
            <div className='comment__header'>
              <MemberProfileItem member={createdBy} />
              <span className='comment__created-at'>{moment(task.createdAt).format('MMMM Do YYYY, h:mm a')}</span>
            </div>
            <div className='comment__content'>
              Task
              <span className='dummy-comment-task-name'>{name}</span>
              created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardTaskDetails;