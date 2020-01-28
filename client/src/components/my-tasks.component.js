import React, { useEffect, useContext } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';

import Snackbar from './snackbar.component';
import Spinner from './spinner.component';
import MyTasksLists from './my-tasks-lists.component';
import { MyTasksContext } from '../context/MyTasksContext';
import { BoardContext } from '../context/BoardContext';

import './my-tasks.styles.scss';
import MyTasksTaskDetailsContainer from './my-tasks-task-details-container.component';

const MyTasks = () => {
  const match = useRouteMatch();
  const { clearBoard } = useContext(BoardContext);
  const {
    myTasksState,
    fetchUserTasks,
    clearMyTasksError
  } = useContext(MyTasksContext);

  useEffect(() => {
    clearBoard();
  }, [clearBoard])

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks])

  useEffect(() => {
    if (myTasksState.errorMessage) {
      setTimeout(() => {
        clearMyTasksError();
      }, 4000)
    }
  }, [myTasksState.errorMessage, clearMyTasksError])

  return (
    <div className='my-tasks'>
      {
        myTasksState.isLoading
          ? <Spinner />
          :
          myTasksState.tasksCount > 0
            ? <MyTasksLists />
            : <h2 className='no-task-message'>No assigned tasks</h2>
      }
      <Route path={`${match.path}/:taskId`} component={MyTasksTaskDetailsContainer} />
      {
        myTasksState.errorMessage &&
        <Snackbar text={myTasksState.errorMessage} />
      }
    </div>
  );
}

export default MyTasks;