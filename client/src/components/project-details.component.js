import React, { useEffect, useCallback, useContext } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

import BoardLists from './board-lists.component';
import { BoardContext } from '../context/BoardContext';
import './project-details.styles.scss';

const ProjectDetails = () => {
  console.log('render')
  const { fetchBoardData, addBoardError, addList } = useContext(BoardContext);
  const { projectId } = useParams();
  const token = localStorage.getItem('token');
  const socket = useCallback(io('http://localhost:5000/', {
    transports: ['websocket'],
    query: `token=${token}`
  }), []);

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
      addList(newList)
    })

    socket.on('new_error', errorMessage => {
      addBoardError(errorMessage);
    })

    return () => {
      socket.emit('leave', projectId);
      socket.off('data_updated')
      socket.disconnect();
    }

  }, [
    socket,
    projectId,
    addList,
    addBoardError,
    fetchBoardData
  ])

  return (
    <div className='project-details'>
      <header className='project-details__header'>
        {/* <div className='project-list-item__picture' style={{ backgroundColor: `${project.color}` }}>{project.name.substring(0, 1).toUpperCase()}</div> */}
      </header>
      <div className='project-details__main-content'>
        <BoardLists socket={socket} />
      </div>
    </div>
  );
}

export default ProjectDetails;