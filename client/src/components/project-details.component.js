import React, { useEffect, useContext, useState } from 'react';
import { Route, useParams, useRouteMatch } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import BoardLists from './board-lists.component';
import BoardHeader from './board-header.component';
import Spinner from './spinner.component';
import Snackbar from './snackbar.component';
import BoardTaskDetailsContainer from './board-task-details-container.component';
import './project-details.styles.scss';

const ProjectDetails = () => {
  const match = useRouteMatch();
  const { socket } = useContext(SocketContext);
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
    assignUserToTask,
    assignTaskToNewList,
    updateTaskAttributes,
    addComment,
    removeCurrentlyOpenedTask
  } = useContext(BoardContext);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const { projectId } = useParams();

  useEffect(() => {
    if (boardState.errorMessage) {
      setShowErrorSnackbar(true);
      setTimeout(() => {
        document.location.reload();
      }, 3000)
    }
  }, [boardState.errorMessage])

  useEffect(() => {
    const fetchData = () => {
      fetchBoardDataStart();
      socket.emit('initial_data', projectId);
    }

    socket.emit('join', projectId);
    fetchData();

    socket.on('data_updated', data => {
      fetchBoardData(data);
    })

    socket.on('member_added', member => {
      addMember(member);
    })

    socket.on('member_deleted', _id => {
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

    socket.on('task_assigned', ({ taskId, user }) => {
      assignUserToTask({ taskId, user });
    })

    socket.on('task_added', newTask => {
      addTask(newTask);
    })

    socket.on('task_deleted', deletedTask => {
      removeCurrentlyOpenedTask(deletedTask.taskId)
      deleteTask(deletedTask);
    })

    socket.on('task_assigned_to_new_list', data => {
      assignTaskToNewList(data);
    })

    socket.on('task_attributes_updated', data => {
      updateTaskAttributes(data);
    })

    socket.on('comment_added', data => {
      addComment(data);
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
      socket.off('task_assigned');
      socket.off('task_assigned_to_new_list');
      socket.off('task_attributes_updated');
      socket.off('comment_added');
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
      updateListName,
      assignUserToTask,
      assignTaskToNewList,
      updateTaskAttributes,
      addComment,
      removeCurrentlyOpenedTask
    ])

  return (
    <React.Fragment>
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
              {
                showErrorSnackbar &&
                <Snackbar text={boardState.errorMessage} type='error' actionText='reload' action={() => document.location.reload()} />
              }
            </React.Fragment>
        }
      </div>
      <Route path={`${match.path}/:taskId`} component={BoardTaskDetailsContainer} />
    </React.Fragment>
  );
}

export default ProjectDetails;