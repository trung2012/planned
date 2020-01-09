import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { generateRequestConfig, removeObjectProperty } from '../utils/helper';

const initialState = {
  currentProject: {},
  lists: {},
  tasks: {},
  members: [],
  memberIds: [],
  users: [],
  errorMessage: null,
  isLoading: false,
  showTaskDetails: false,
  currentlyOpenedTask: null,
  isCurrentlyOpenedTaskDeleted: false
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
        currentProject: { ...state.currentProject, lists: [...state.currentProject.lists, action.payload._id] },
        lists: {
          ...state.lists,
          [action.payload._id]: action.payload
        }
      }
    case 'delete_list':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          lists: state.currentProject.lists.filter(listId => listId !== action.payload._id)
        },
        lists: removeObjectProperty(state.lists, action.payload._id)
      }
    case 'update_list_name':
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload._id]: { ...state.lists[action.payload._id], name: action.payload.name }
        }
      }
    case 'add_task': {
      const listId = action.payload.list;
      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: { ...state.lists[listId], tasks: [...state.lists[listId].tasks, action.payload._id] }
        },
        tasks: {
          ...state.tasks,
          [action.payload._id]: action.payload
        }
      }
    }
    case 'delete_task': {
      const { taskId, listId } = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: { ...state.lists[listId], tasks: state.lists[listId].tasks.filter(_id => _id !== taskId) }
        },
        tasks: removeObjectProperty(state.tasks, action.payload.taskId)
      }
    }
    case 'assign_user_to_task': {
      const { taskId, user, updatedAt } = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], assignee: user, updatedAt }
        }
      }
    }
    case 'unassign_task': {
      const { taskId, updatedAt } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], assignee: null, updatedAt }
        }
      }
    }
    case 'assign_task_to_new_list': {
      const { task, oldListId, newListId, updatedAt } = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [oldListId]: {
            ...state.lists[oldListId], tasks: state.lists[oldListId].tasks.filter(id => id !== task._id)
          },
          [newListId]: {
            ...state.lists[newListId], tasks: [...state.lists[newListId].tasks, task._id]
          }
        },
        tasks: {
          ...state.tasks,
          [task._id]: { ...state.tasks[task._id], list: newListId, updatedAt }
        }
      }
    }
    case 'update_task_attributes': {
      const { taskId, data } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], ...data }
        }
      }
    }
    case 'add_comment': {
      const comment = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [comment.task]: { ...state.tasks[comment.task], comments: [comment, ...state.tasks[comment.task].comments] }
        }
      }
    }
    case 'add_task_attachment':
      const file = action.payload;
      const taskId = file.task;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], attachments: [...state.tasks[taskId].attachments, file], updatedAt: Date.now() }
        }
      }
    case 'delete_task_attachment': {
      const file = action.payload;
      const taskId = file.task;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            attachments: state.tasks[taskId].attachments.filter(attachment => attachment._id !== file._id),
            updatedAt: Date.now()
          }
        }
      }
    }
    case 'rename_attachment': {
      const { file, newName } = action.payload;
      const taskId = file.task;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            attachments: state.tasks[taskId].attachments.map(attachment => {
              if (attachment._id === file._id) {
                return { ...attachment, name: newName };
              } else {
                return attachment;
              }
            }),
            updatedAt: Date.now()
          }
        }
      }
    }
    case 'set_currently_opened_task':
      return {
        ...state,
        currentlyOpenedTask: action.payload
      }
    case 'remove_currently_opened_task': {
      if (action.payload === state.currentlyOpenedTask) {
        return {
          ...state,
          currentlyOpenedTask: null,
          isCurrentlyOpenedTaskDeleted: true
        }
      } else {
        return state;
      }
    }
    case 'set_is_currently_deleted':
      return {
        ...state,
        isCurrentlyOpenedTaskDeleted: action.payload
      }
    case 'set_show_task_details':
      return {
        ...state,
        showTaskDetails: action.payload
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

  const deleteTask = useCallback(data => {
    dispatch({ type: 'delete_task', payload: data });
  }, [])

  const assignUserToTask = useCallback(data => {
    dispatch({ type: 'assign_user_to_task', payload: data });
  }, [])

  const unassignUserFromTask = useCallback(taskId => {
    dispatch({ type: 'unassign_task', payload: taskId });
  }, [])

  const addBoardError = useCallback((errorMessage) => {
    dispatch({ type: 'add_board_error', payload: errorMessage });
  }, [])

  const clearBoardError = useCallback(() => {
    dispatch({ type: 'clear_board_error' });
  }, []);

  const assignTaskToNewList = useCallback((data) => {
    dispatch({ type: 'assign_task_to_new_list', payload: data });
  }, [])

  const updateTaskAttributes = useCallback(({ taskId, data }) => {
    dispatch({ type: 'update_task_attributes', payload: { taskId, data } });
  }, [])

  const addComment = useCallback(comment => {
    dispatch({ type: 'add_comment', payload: comment });
  }, [])

  const addTaskAttachment = useCallback(file => {
    dispatch({ type: 'add_task_attachment', payload: file });
  }, [])

  const deleteTaskAttachment = useCallback(file => {
    dispatch({ type: 'delete_task_attachment', payload: file });
  }, [])

  const renameTaskAttachment = useCallback(data => {
    dispatch({ type: 'rename_attachment', payload: data });
  }, [])

  const setCurrentlyOpenedTask = taskId => {
    dispatch({ type: 'set_currently_opened_task', payload: taskId });
  }

  const removeCurrentlyOpenedTask = useCallback((taskId) => {
    dispatch({ type: 'remove_currently_opened_task', payload: taskId });
  }, [])

  const setIsCurrentlyOpenedTaskDeleted = (value) => {
    dispatch({ type: 'set_is_currently_deleted', payload: value });
  }

  const setShowTaskDetails = (value) => {
    dispatch({ type: 'set_show_task_details', payload: value });
  }

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
        updateListName,
        assignUserToTask,
        unassignUserFromTask,
        assignTaskToNewList,
        updateTaskAttributes,
        setShowTaskDetails,
        setCurrentlyOpenedTask,
        removeCurrentlyOpenedTask,
        setIsCurrentlyOpenedTaskDeleted,
        addComment,
        addTaskAttachment,
        deleteTaskAttachment,
        renameTaskAttachment
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
