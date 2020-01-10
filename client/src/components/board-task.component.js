import React, { useState, useContext } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import MoreOptions from './more-options.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import TaskAssignment from './task-assignment.component';
import { handleTaskAssignment } from '../utils/useTaskAssignment';

import './board-task.styles.scss';

const BoardTask = ({ task, list, index }) => {
  const { url } = useRouteMatch();
  const { projectId } = useParams();
  const history = useHistory();
  const { socket } = useContext(SocketContext);

  const { boardState, deleteTask, setShowTaskDetails, assignUserToTask, unassignUserFromTask, setCurrentlyOpenedTask } = useContext(BoardContext);
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, task._id, projectId, assignUserToTask, unassignUserFromTask);

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
            className='board-task'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={
              {
                ...provided.draggableProps.style
              }
            }
          >
            <div className='board-task__top-content'>
              <div className='board-task__heading'>
                <span
                  onClick={handleTaskDetailsToggle}
                >
                  {task.name}
                </span>
                <OptionsIcon className='options-icon' onClick={() => setShowTaskOptions(!showTaskOptions)}>...</OptionsIcon>
              </div>
              <div className='board-task__content' onClick={handleTaskDetailsToggle}>
                <div>icons</div>
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
              <div className='board-task__assignee'>
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

export default BoardTask;