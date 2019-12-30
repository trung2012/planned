import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import BoardLists from './board-lists.component';
import BoardHeader from './board-header.component';
import './project-details.styles.scss';

const ProjectDetails = () => {
  console.log('render')
  const socket = useContext(SocketContext);
  const {
    fetchBoardData,
    addBoardError,
    addList,
    addTask,
    deleteTask,
    deleteList,
    updateListName
  } = useContext(BoardContext);
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

    socket.on('list_deleted', deletedList => {
      deleteList(deletedList);
    })

    socket.on('list_name_updated', list => {
      updateListName(list);
    })

    socket.on('task_added', newTask => {
      addTask(newTask);
    })

    socket.on('task_deleted', deletedTask => {
      deleteTask(deletedTask);
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
      fetchBoardData,
      deleteTask,
      deleteList,
      updateListName
    ])

  return (
    <div className='project-details'>
      <BoardHeader />
      <div className='project-details__main-content'>
        <BoardLists />
      </div>
    </div>
  );
}

export default ProjectDetails;