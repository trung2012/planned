import React, { useState, useContext } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import MoreOptions from './more-options.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import TaskAssignment from './task-assignment.component';
import { handleTaskAssignment, handleTaskUpdate } from '../utils/useTaskUpdate';
import getSelectIcon from '../utils/getSelectIcon';

import './board-task.styles.scss';

const BoardTask = ({ task, list, index }) => {
  const { url } = useRouteMatch();
  const { projectId } = useParams();
  const history = useHistory();
  const { socket } = useContext(SocketContext);

  const {
    boardState,
    deleteTask,
    setShowTaskDetails,
    assignUserToTask,
    unassignUserFromTask,
    setCurrentlyOpenedTask,
    updateTaskAttributes
  } = useContext(BoardContext);
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, task._id, projectId, { assignUserToTask, unassignUserFromTask });
  const { handleCompletionToggle } = handleTaskUpdate(socket, task._id, projectId, { updateTaskAttributes });

  const taskClassName = task.progress === 'Completed' ? 'board-task--completed' : 'board-task'

  const handleDeleteClick = () => {
    deleteTask({ taskId: task._id, listId: list._id });
    socket.emit('delete_task', { taskId: task._id, listId: list._id, projectId });
    setShowTaskOptions(false);
  }

  const handleTaskDetailsToggle = () => {
    setCurrentlyOpenedTask(task._id);
    history.push(`${url}/${task._id}`);
    setShowTaskDetails(true);
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {
        (provided) => (
          <div
            className={taskClassName}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={
              {
                ...provided.draggableProps.style
              }
            }
          >
            <div className={`${taskClassName}__top-content`}>
              <div className={`${taskClassName}__heading`}>
                <div className={`${taskClassName}__name-container`}>
                  <span className={`${taskClassName}__name-icon`} onClick={() => handleCompletionToggle(task.progress)}>
                    {
                      (task.progress === 'In progress')
                        ? getSelectIcon('Not started')
                        : getSelectIcon(task.progress)
                    }
                  </span>
                  <span
                    className={`${taskClassName}__name`}
                    onClick={handleTaskDetailsToggle}
                  >
                    {task.name}
                  </span>
                </div>
                <OptionsIcon className='options-icon' onClick={() => setShowTaskOptions(!showTaskOptions)}>...</OptionsIcon>
              </div>
              <div className={`${taskClassName}__content`} onClick={handleTaskDetailsToggle}>
                <div className={`${taskClassName}__icons`}>
                  icons
                </div>
              </div>
              {
                showTaskOptions &&
                <MoreOptions dismiss={() => setShowTaskOptions(false)}>
                  <div className='more-options-item'>Copy Task</div>
                  <div className='more-options-item'>Assign</div>
                  <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
                </MoreOptions>
              }
            </div>
            {
              task.assignee &&
              <div className={`${taskClassName}__assignee`}>
                <TaskAssignment
                  assignee={task.assignee}
                  members={boardState.members}
                  handleAssignTask={handleAssignTask}
                  handleUnassignTask={handleUnassignTask}
                />
              </div>
            }
          </div>
        )
      }
    </Draggable>

  );
}

export default React.memo(BoardTask);