import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { generateRequestConfig } from '../utils/generateRequestConfig';

const initialState = {
  currentProject: {},
  lists: [],
  members: [],
  memberIds: [],
  users: [],
  errorMessage: null,
  isLoading: false
}

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'fetching_data':
      return {
        ...state,
        isLoading: true,
      }
    case 'fetch_board_data_complete':
      return {
        ...initialState,
        ...action.payload,
        isLoading: false
      };
    case 'fetch_users_complete':
      return {
        ...state,
        users: action.payload.filter(user => !state.memberIds.includes(user._id))
      }
    case 'add_member':
      return {
        ...state,
        members: [...state.members, action.payload],
        memberIds: [...state.memberIds, action.payload._id]
      }
    case 'delete_member':
      return {
        ...state,
        members: state.members.filter(member => member._id !== action.payload),
        memberIds: state.memberIds.filter(memberId => memberId !== action.payload)
      }
    case 'add_list':
      return {
        ...state,
        lists: [...state.lists, action.payload]
      }
    case 'delete_list':
      return {
        ...state,
        lists: state.lists.filter(list => list._id !== action.payload._id)
      }
    case 'update_list_name':
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list._id === action.payload._id) {
            return { ...list, name: action.payload.name };
          } else {
            return list;
          }
        })
      }
    case 'add_task':
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list._id === action.payload.list._id) {
            let newTasks = list.tasks;
            newTasks.push(action.payload);
            return { ...list, tasks: newTasks }
          } else {
            return list;
          }
        })
      }
    case 'delete_task':
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list._id === action.payload.list) {
            let newTasks = list.tasks.filter(task => task._id !== action.payload._id);
            return { ...list, tasks: newTasks };
          } else {
            return list;
          }
        })
      }
    case 'add_board_error':
      return {
        ...state,
        errorMessage: action.payload
      }
    case 'clear_board_error':
      return {
        ...state,
        errorMessage: null
      }
    case 'clear_board':
      return { ...initialState };
    default:
      return state;
  }
}

export const BoardContext = React.createContext();

export const BoardProvider = ({ children }) => {
  const [boardState, dispatch] = useReducer(boardReducer, initialState);

  const fetchBoardDataStart = useCallback(() => {
    dispatch({ type: 'fetching_data' });
  }, [])

  const fetchBoardData = useCallback((data) => {
    dispatch({ type: 'fetch_board_data_complete', payload: data });
  }, [])

  const fetchUsers = useCallback(async (userName, callback) => {
    const requestConfig = generateRequestConfig();
    if (requestConfig) {
      try {
        const response = await axios.get(`/api/users/all?name=${userName}`, requestConfig);
        dispatch({ type: 'fetch_users_complete', payload: response.data });
        if (callback) {
          callback();
        }
      } catch (err) {
        dispatch({ type: 'add_board_error', payload: err.response.data });
      }
    }
  }, [])

  const addMember = useCallback(user => {
    dispatch({ type: 'add_member', payload: user });
  }, [])

  const deleteMember = useCallback(_id => {
    dispatch({ type: 'delete_member', payload: _id });
  }, [])

  const addList = useCallback((list) => {
    dispatch({ type: 'add_list', payload: list });
  }, [])

  const deleteList = useCallback(list => {
    dispatch({ type: 'delete_list', payload: list });
  }, [])

  const updateListName = useCallback(list => {
    dispatch({ type: 'update_list_name', payload: list });
  }, [])

  const addTask = useCallback(task => {
    dispatch({ type: 'add_task', payload: task });
  }, [])

  const deleteTask = useCallback(task => {
    dispatch({ type: 'delete_task', payload: task });
  }, [])

  const addBoardError = useCallback((errorMessage) => {
    dispatch({ type: 'add_board_error', payload: errorMessage });
  }, [])

  const clearBoardError = useCallback(() => {
    dispatch({ type: 'clear_board_error' });
  }, []);

  const clearBoard = () => {
    dispatch({ type: 'clear_board' })
  }

  return (
    <BoardContext.Provider
      value={{
        boardState,
        clearBoard,
        addBoardError,
        addList,
        addTask,
        addMember,
        clearBoardError,
        fetchBoardDataStart,
        fetchBoardData,
        fetchUsers,
        deleteMember,
        deleteTask,
        deleteList,
        updateListName
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
