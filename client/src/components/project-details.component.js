import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import BoardLists from './board-lists.component';
import BoardHeader from './board-header.component';
import './project-details.styles.scss';
import Spinner from './spinner.component';

const ProjectDetails = () => {
  const socket = useContext(SocketContext);
  const {
    boardState,
    fetchBoardData,
    fetchBoardDataStart,
    addBoardError,
    addList,
    addTask,
    addMember,
    deleteMember,
    deleteTask,
    deleteList,
    updateListName,
  } = useContext(BoardContext);
  const { projectId } = useParams();

  useEffect(() => {
    socket.emit('join', projectId);
    const fetchData = () => {
      fetchBoardDataStart();
      socket.emit('initial_data', projectId);
    }

    fetchData();

    socket.on('data_updated', data => {
      fetchBoardData(data);
    })

    socket.on('member_added', member => {
      addMember(member);
    })

    socket.on('member_deleted', _id => {
      console.log(_id)
      deleteMember(_id);
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
      socket.off('data_updated');
      socket.off('member_added');
      socket.off('member_deleted');
      socket.off('list_added');
      socket.off('list_deleted');
      socket.off('list_name_updated');
      socket.off('task_added');
      socket.off('task_deleted');
      socket.off('new_error');
    }

  },
    [
      socket,
      projectId,
      addList,
      addBoardError,
      addTask,
      addMember,
      deleteMember,
      fetchBoardData,
      fetchBoardDataStart,
      deleteTask,
      deleteList,
      updateListName
    ])

  return (
    <div className='project-details'>
      {
        boardState.isLoading ?
          <Spinner />
          :
          <React.Fragment>
            <BoardHeader />
            <div className='project-details__main-content'>
              <BoardLists />
            </div>
          </React.Fragment>
      }
    </div>
  );
}

export default ProjectDetails;