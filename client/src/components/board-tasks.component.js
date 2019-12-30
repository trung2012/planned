import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../context/SocketContext';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import BoardTask from './board-task.component';
import BoardTaskAdd from './board-task-add.component';
import './board-tasks.styles.scss';

const BoardTasks = ({ list }) => {
  const socket = useContext(SocketContext);
  const { projectId } = useParams();
  const [showTaskAdd, setShowTaskAdd] = useState(false);

  const handleAddSubmit = (taskData) => {
    if (taskData) {
      socket.emit('add_task', { taskData, projectId });
      setShowTaskAdd(false);
    }
  }

  return (
    <div className='board-tasks'>
      <div className='board-tasks__add-button' onClick={() => setShowTaskAdd(!showTaskAdd)}>
        <AddIcon className='add-icon' />
        Add task
      </div>
      {
        showTaskAdd &&
        <BoardTaskAdd submit={handleAddSubmit} listId={list._id} dismiss={() => setShowTaskAdd(false)} />
      }
      {
        list &&
        (
          list.tasks.length > 0 &&
          list.tasks.map(task => (
            <BoardTask key={task._id} task={task} />
          ))
        )
      }
    </div>
  );
}

export default BoardTasks;