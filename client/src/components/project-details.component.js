import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import BoardLists from './board-lists.component';
import { BoardContext } from '../context/BoardContext';
import './project-details.styles.scss';
import { SocketContext } from '../context/SocketContext';

const ProjectDetails = () => {
  const socket = useContext(SocketContext);
  const { fetchBoardData, addBoardError, addList, addTask } = useContext(BoardContext);
  const { projectId } = useParams();

  useEffect(() => {
    socket.emit('join', projectId);
    const fetchData = () => {
      socket.emit('initial_data', projectId);
    }

    fetchData();

    socket.on('data_updated', data => {
      fetchBoardData(data);
    })

    socket.on('list_added', newList => {
      addList(newList);
    })

    socket.on('task_added', newTask => {
      addTask(newTask);
    })

    socket.on('new_error', errorMessage => {
      addBoardError(errorMessage);
    })

    return () => {
      socket.emit('leave', projectId);
      socket.off('data_updated')
      socket.off('list_added')
      socket.off('task_added')
      socket.off('new_error')
    }

  },
    [
      socket,
      projectId,
      addList,
      addBoardError,
      addTask,
      fetchBoardData
    ])

  return (
    <div className='project-details'>
      <header className='project-details__header'>
        {/* <div className='project-list-item__picture' style={{ backgroundColor: `${project.color}` }}>{project.name.substring(0, 1).toUpperCase()}</div> */}
      </header>
      <div className='project-details__main-content'>
        <BoardLists />
      </div>
    </div>
  );
}

export default ProjectDetails;