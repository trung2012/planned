import React, { useEffect, useContext } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';

import BoardTaskDetailsContainer from './board-task-details-container.component';
import Spinner from './spinner.component';
import MyTasksLists from './my-tasks-lists.component';
import { MyTasksContext } from '../context/MyTasksContext';

import './my-tasks.styles.scss';

const MyTasks = () => {
  const match = useRouteMatch();
  const {
    myTasksState,
    fetchUserTasks,
    clearMyTasksError
  } = useContext(MyTasksContext);

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks])

  useEffect(() => {
    if (myTasksState.errorMessage) {
      setTimeout(() => {
        clearMyTasksError();
      }, 3000)
    }
  }, [myTasksState.errorMessage, clearMyTasksError])

  return (
    <div className='my-tasks'>
      {
        myTasksState.isLoading
          ? <Spinner />
          :
          <MyTasksLists />
      }
      <Route path={`${match.path}/:taskId`} component={BoardTaskDetailsContainer} />
    </div>
  );
}

export default MyTasks;