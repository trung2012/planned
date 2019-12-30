import React, { useCallback, useReducer } from 'react';

const initialState = {
  currentProject: {},
  lists: [],
  members: [],
  errorMessage: null
}

const boardReducer = (state, action) => {
  switch (action.type) {
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
            return action.payload;
          } else {
            return list;
          }
        })
      }
    case 'add_task':
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list._id === action.payload.list) {
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
    case 'fetch_board_data':
      return {
        ...state,
        ...action.payload
      }
    case 'add_board_error':
      return {
        ...state,
        errorMessage: action.payload
      }
    case 'clear_board_error_message':
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

  const fetchBoardData = useCallback((data) => {
    dispatch({ type: 'fetch_board_data', payload: data });
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
    dispatch({ type: 'clear_board_error_message' });
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
        clearBoardError,
        fetchBoardData,
        deleteTask,
        deleteList,
        updateListName
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
