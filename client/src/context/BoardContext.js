import React, { useCallback, useReducer } from 'react';

const initialState = {
  currentProject: {

  },
  lists: [
    {
      _id: '1',
      name: 'Test',
      project: '5e065c246e5c5f1d843b19d3',
      tasks: [
        {
          _id: '11',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '12',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    },
    {
      _id: '2',
      name: 'Test 2',
      project: '5e065c246e5c5f1d843b19d3',
      tasks: [
        {
          _id: '21',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '22',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    },
    {
      _id: '3',
      name: 'Test 3',
      project: '5e065c246e5c5f1d843b19d3',
      tasks: [
        {
          _id: '31',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '32',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    }
  ],
  errorMessage: null
}

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'add_list':
      return {
        ...state,
        lists: [...state.lists, action.payload]
      }
    case 'fetch_board_data':
      return {
        ...state,
        ...action.payload
      }
    case 'clear_board':
      return { ...initialState };
    case 'add_board_error':
      return {
        ...state,
        errorMessage: action.payload
      }
    default:
      return state;
  }
}

export const BoardContext = React.createContext();

export const BoardProvider = ({ children }) => {
  const [boardState, dispatch] = useReducer(boardReducer, initialState);

  const fetchBoardData = useCallback((data) => {
    dispatch({ type: 'fetch_board_data', payload: data })
  }, [])

  const addList = useCallback((list) => {
    dispatch({ type: 'add_list', payload: list })
  }, [])

  const addBoardError = useCallback((errorMessage) => {
    dispatch({ type: 'add_board_error', payload: errorMessage });
  }, [])

  const clearBoard = () => {
    dispatch({ type: 'clear_board' })
  }

  return (
    <BoardContext.Provider
      value={{ boardState, clearBoard, addBoardError, addList, fetchBoardData }}
    >
      {children}
    </BoardContext.Provider>
  );
};
