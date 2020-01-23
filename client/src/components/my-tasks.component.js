import React, { useEffect, useState } from 'react';
import axios from 'axios';

import BoardListsGrouped from './board-lists-grouped.component';
import { getGroupedListsData, generateRequestConfig } from '../utils/helper';

import './my-tasks.styles.scss';

const MyTasks = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [taskLists, setTaskLists] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      const requestConfig = generateRequestConfig();

      if (requestConfig) {
        try {
          const response = await axios.get('/api/users/mytasks', requestConfig);
          const { listsByProgressArray } = getGroupedListsData([], response.data);
          setTaskLists(listsByProgressArray);
        } catch (err) {
          setErrorMessage(err.response.data);
        }
      }
    }

    fetchUserTasks();
  }, [])

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000)
    }
  }, [errorMessage])

  return (
    <div className='my-tasks'>
      <BoardListsGrouped lists={taskLists} isViewingMyTasks={true} />
    </div>
  );
}

export default MyTasks;