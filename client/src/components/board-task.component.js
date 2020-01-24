import React, { useState, useContext } from 'react';
import moment from 'moment';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import MoreOptions from './more-options.component';
import BoardTaskIcons from './board-task-icons.component';
import TaskAssignment from './task-assignment.component';
import TaskAssignmentDropdown from './task-assignment-dropdown.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import getSelectIcon from '../utils/getSelectIcon';
import { handleTaskAssignment, handleTaskUpdate } from '../utils/updateTasks';
import { AuthContext } from '../context/AuthContext';
import UserProfilePicture from './user-profile-picture.component';
import { MyTasksContext } from '../context/MyTasksContext';

import './board-task.styles.scss';

const BoardTask = ({ task, index, list, isViewingMyTasks }) => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { socket } = useContext(SocketContext);
  const { authState } = useContext(AuthContext);
  const {
    boardState,
    deleteTask,
    setShowTaskDetails,
    assignUserToTask,
    unassignUserFromTask,
    setCurrentlyOpenedTask,
    updateTaskAttributes,
  } = useContext(BoardContext);
  const {
    deleteTaskFromMyTasks,
    updateTaskInMyTasks,
    toggleTaskCompletion,
    unassignTaskInMyTasks,
    setMyTasksCurrentlyOpenedTask
  } = useContext(MyTasksContext);

  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, task._id, task.project, { assignUserToTask, unassignUserFromTask });
  const { handleCompletionToggle, handleAttributeUpdate } = handleTaskUpdate(socket, task._id, task.project, { updateTaskAttributes });

  const highlighted = boardState.highlightedMemberId
    && task.assignee
    && boardState.highlightedMemberId === task.assignee._id
    ? 'highlighted'
    : ''

  const taskClassName = task.progress === 'Completed' ? 'board-task--completed' : 'board-task'

  const handleDeleteClick = event => {
    event.stopPropagation();
    if (isViewingMyTasks) {
      deleteTaskFromMyTasks({ taskId: task._id, listId: list._id });
    } else {
      deleteTask({ taskId: task._id, listId: list._id });
    }
    socket.emit('delete_task', { taskId: task._id, listId: list._id, projectId: task.project });
    setShowTaskOptions(false);
  }

  const handleTaskDetailsToggle = event => {
    event.stopPropagation();
    if (isViewingMyTasks) {
      setMyTasksCurrentlyOpenedTask(task._id);
      history.push(`${url}/${task._id}`);
    } else {
      setCurrentlyOpenedTask(task._id);
      history.push(`${url}/${task._id}`);
    }
    setShowTaskDetails(true);
  }

  const handleOptionsIconClick = event => {
    event.stopPropagation();
    setShowTaskOptions(!showTaskOptions);
  }

  const handleSetComplete = event => {
    event.stopPropagation();
    
    const newTask = {
      ...task,
      updatedAt: moment().format()
    }

    handleCompletionToggle(task.progress);
    if (task.progress === 'Completed') {
      handleAttributeUpdate({ completedBy: null });
      toggleTaskCompletion({
        listId: list._id,
        newTask: {
          ...newTask,
          progress: 'Not started',
          completedBy: null
        }
      });
    } else {
      handleAttributeUpdate({ completedBy: authState.user });
      toggleTaskCompletion({
        listId: list._id,
        newTask: {
          ...newTask,
          progress: 'Completed',
          completedBy: authState.user
        }
      });
    }
  }

  const updateTask = updatedData => {
    const newTask = {
      ...task,
      ...updatedData,
      updatedAt: moment().format()
    }
    if (isViewingMyTasks) {
      updateTaskInMyTasks({ newTask, listId: list._id });
    }

    handleAttributeUpdate(updatedData);
  }

  const handleTaskAssignmentRemove = () => {
    if (isViewingMyTasks) {
      unassignTaskInMyTasks({ taskId: task._id, listId: list._id});
    }

    handleUnassignTask();
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {
        (provided) => (
          <div
            className={`${taskClassName} ${highlighted}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={
              {
                ...provided.draggableProps.style
              }
            }
          >
            <div className={`${taskClassName}__top`} onClick={handleTaskDetailsToggle}>
              <div className={`${taskClassName}__heading`}>
                <div className={`${taskClassName}__name-container`}>
                  <span
                    className={`${taskClassName}__name-icon`}
                    title={task.progress === 'Completed' ? 'Reactivate task' : 'Set complete'}
                    onClick={handleSetComplete}>
                    {
                      (task.progress === 'In progress')
                        ? getSelectIcon('Not started')
                        : getSelectIcon(task.progress)
                    }
                  </span>
                  <p
                    className={`${taskClassName}__name`}
                  >
                    {task.name}
                  </p>
                </div>
              </div>
              <div className={`${taskClassName}__content`}>
                <BoardTaskIcons task={task} taskClassName={taskClassName} updateTask={updateTask}/>
                <OptionsIcon className='options-icon' onClick={handleOptionsIconClick} title='More options'>...</OptionsIcon>
              </div>
              {
                showTaskOptions &&
                <MoreOptions dismiss={() => setShowTaskOptions(false)} >
                  {
                    !task.completedBy &&
                    <div
                      className='more-options-item'
                      onClick={event => {
                        event.stopPropagation();
                        setShowAssignmentDropdown(true);
                        setShowTaskOptions(false);
                      }}
                    >
                      Assign
                    </div>
                  }
                  <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
                </MoreOptions>
              }
            </div>
            {
              task.completedBy ?
                <div
                  className={`${taskClassName}__assignee`}
                  title={`Completed by ${task.completedBy.name} on ${moment(task.updatedAt).format('MM/DD/YYYY')}`}
                >
                  <div className={`${taskClassName}__completed-by`}>
                    <UserProfilePicture
                      backgroundColor={task.completedBy.color}
                      initials={task.completedBy.initials}
                      name={task.completedBy.name}
                      avatarUrl={task.completedBy.avatar && task.completedBy.avatar.url}
                    />
                    <div className='completed-by-text'>
                      {`Completed by ${task.completedBy.name} on ${moment(task.updatedAt).format('MM/DD/YYYY')}`}
                    </div>
                  </div>
                </div>
                : task.assignee
                && <div className={`${taskClassName}__assignee`}>
                  <TaskAssignment
                    assignee={task.assignee}
                    members={boardState.members}
                    handleAssignTask={handleAssignTask}
                    handleUnassignTask={handleTaskAssignmentRemove}
                  />
                </div>
            }
            {
              showAssignmentDropdown &&
              <TaskAssignmentDropdown
                dismiss={() => setShowAssignmentDropdown(false)}
                members={boardState.members}
                assignee={task.assignee}
                removeMember={handleTaskAssignmentRemove}
                onMemberClick={handleAssignTask}
              />
            }
          </div>
        )
      }
    </Draggable>
  );
}

export default React.memo(BoardTask);