import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

import Spinner from './spinner.component';
import MyTasksLists from './my-tasks-lists.component';
import { getGroupedListsData, generateRequestConfig } from '../utils/helper';

import './my-tasks.styles.scss';

const myTaskReducer = (state, action) => {
  switch (action.type) {
    case 'fetching_mytasks':
      return {
        ...state,
        isLoading: true
      }
    case 'fetch_mytasks':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      }
    case 'add_error':
      return {
        ...state,
        errorMessage: action.payload
      }
    case 'update_single_list': {
      const list = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [list._id]: list
        }
      }
    }
    case 'update_multiple_lists': {
      const [startList, endList] = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [startList._id]: startList,
          [endList._id]: endList
        }
      }
    }
    case 'clear_error':
      return {
        ...state,
        errorMessage: null
      }
    default:
      return state;
  }
}

const MyTasks = () => {
  const [myTasksState, dispatch] = useReducer(myTaskReducer, {
    lists: {},
    listsOrder: [],
    errorMessage: null,
    isLoading: false
  })

  useEffect(() => {
    const fetchUserTasks = async () => {
      const requestConfig = generateRequestConfig();
      dispatch({ type: 'fetching_mytasks' });

      if (requestConfig) {
        try {
          const response = await axios.get('/api/users/mytasks', requestConfig);
          const { listsByProgress, listsByProgressIds } = getGroupedListsData([], response.data);
          dispatch({ type: 'fetch_mytasks', payload: { lists: listsByProgress, listsOrder: listsByProgressIds } });
        } catch (err) {
          dispatch({ type: 'add_error', payload: err.response.data });
        }
      }
    }

    fetchUserTasks();
  }, [])

  useEffect(() => {
    if (myTasksState.errorMessage) {
      setTimeout(() => {
        dispatch({ type: 'clear_error' });
      }, 3000)
    }
  }, [myTasksState.errorMessage])

  const updateSingleList = list => {
    dispatch({ type: 'update_single_list', payload: list });
  }

  const updateMultipleLists = lists => {
    dispatch({ type: 'update_multiple_lists', payload: lists });
  }

  return (
    <div className='my-tasks'>
      {
        myTasksState.isLoading
          ? <Spinner />
          :
          <MyTasksLists
            lists={myTasksState.lists}
            listsOrder={myTasksState.listsOrder}
            updateSingleList={updateSingleList}
            updateMultipleLists={updateMultipleLists}
          />
      }
    </div>
  );
}

export default MyTasks;