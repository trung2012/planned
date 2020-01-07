import React, { useState, useContext } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';

import MoreOptions from './more-options.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { SocketContext } from '../context/SocketContext';

import { BoardContext } from '../context/BoardContext';
import MemberProfileItem from './member-profile-item.component';
import './board-task.styles.scss';

const BoardTask = ({ task, list }) => {
  const { url } = useRouteMatch();
  const { projectId } = useParams();
  const history = useHistory();
  const { socket } = useContext(SocketContext);

  const { deleteTask, setShowTaskDetails } = useContext(BoardContext);
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const handleDeleteClick = () => {
    deleteTask({ taskId: task._id, listId: list._id });
    socket.emit('delete_task', { taskId: task._id, listId: list._id, projectId });
    setShowTaskOptions(false);
  }

  const handleTaskDetailsToggle = () => {
    history.push(`${url}/${task._id}`);
    setShowTaskDetails(true);
  }

  return (
    <React.Fragment>
      <div className='board-task'>
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
          <div className='board-task__assignee' onClick={handleTaskDetailsToggle}>
            <MemberProfileItem member={task.assignee} />
          </div>
        }
      </div>
    </React.Fragment>
  );
}

export default BoardTask;