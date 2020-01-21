import React, { useState, useContext } from 'react';
import moment from 'moment';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
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

import './board-task.styles.scss';

const BoardTask = ({ task, index }) => {
  const { url } = useRouteMatch();
  const { projectId } = useParams();
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

  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
  const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, task._id, projectId, { assignUserToTask, unassignUserFromTask });
  const { handleCompletionToggle, handleAttributeUpdate } = handleTaskUpdate(socket, task._id, projectId, { updateTaskAttributes });

  const highlighted = boardState.highlightedMemberId
    && task.assignee
    && boardState.highlightedMemberId === task.assignee._id
    ? 'highlighted'
    : ''

  const taskClassName = task.progress === 'Completed' ? 'board-task--completed' : 'board-task'

  const handleDeleteClick = event => {
    event.stopPropagation();
    deleteTask({ taskId: task._id, listId: task.list });
    socket.emit('delete_task', { taskId: task._id, listId: task.list, projectId });
    setShowTaskOptions(false);
  }

  const handleTaskDetailsToggle = event => {
    event.stopPropagation();
    setCurrentlyOpenedTask(task._id);
    history.push(`${url}/${task._id}`);
    setShowTaskDetails(true);
  }

  const handleOptionsIconClick = event => {
    event.stopPropagation();
    setShowTaskOptions(!showTaskOptions);
  }

  const handleSetComplete = event => {
    event.stopPropagation();
    handleCompletionToggle(task.progress);
    if (task.progress === 'Completed') {
      handleAttributeUpdate({ completedBy: null });
    } else {
      handleAttributeUpdate({ completedBy: authState.user });
    }
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
                <BoardTaskIcons task={task} taskClassName={taskClassName} handleAttributeUpdate={handleAttributeUpdate} />
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
                <div className={`${taskClassName}__assignee`}>
                  <div className={`${taskClassName}__completed-by`}>
                    <UserProfilePicture
                      backgroundColor={task.completedBy.color}
                      initials={task.completedBy.initials}
                      name={task.completedBy.name}
                      avatarUrl={task.completedBy.avatar && task.completedBy.avatar.url}
                    />
                    <div className='completed-by-text' title={`Completed by ${task.completedBy.name} on ${moment(task.updatedAt).format('MM/DD/YYYY')}`}>
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
                    handleUnassignTask={handleUnassignTask}
                  />
                </div>
            }
            {
              showAssignmentDropdown &&
              <TaskAssignmentDropdown
                dismiss={() => setShowAssignmentDropdown(false)}
                members={boardState.members}
                assignee={task.assignee}
                removeMember={handleUnassignTask}
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