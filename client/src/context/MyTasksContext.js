import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { getGroupedListsData, generateRequestConfig, removeObjectProperty } from '../utils/helper';

const initialState = {
  lists: {},
  listsOrder: [],
  tasks: {},
  tasksCount: 0,
  errorMessage: null,
  isLoading: false,
  showTaskDetails: false,
  currentlyOpenedTask: null,
  isCurrentlyOpenedTaskDeleted: false
}

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
    case 'toggle_task_completion': {
      const { listId, newTask } = action.payload;
      const newState = { ...state };

      if (state.currentlyOpenedTask && newTask._id === state.currentlyOpenedTask._id) {
        newState.currentlyOpenedTask = {...newState.currentlyOpenedTask,...newTask};  
      }

      newState.lists[listId] = {
        ...newState.lists[listId],
        tasks: newState.lists[listId].tasks.filter(taskId => taskId !== newTask._id)
      }

      newState.lists[newTask.progress] = {
        ...newState.lists[newTask.progress],
        tasks: [newTask._id, ...newState.lists[newTask.progress].tasks]
      }

      newState.tasks[newTask._id] = {...newState.tasks[newTask._id],...newTask};

      return newState;
    }
    case 'update_task_attributes': {
      const { taskId, listId, data } = action.payload;
      const newState = { ...state };

      if (state.currentlyOpenedTask && taskId === state.currentlyOpenedTask._id) {
        newState.currentlyOpenedTask = {...state.tasks[taskId], ...data };
      }

      if (data.progress) {
        newState.lists[listId] = {
          ...newState.lists[listId],
          tasks: newState.lists[listId].tasks.filter(_id => _id !== taskId)
        }

        newState.lists[data.progress] = {
          ...newState.lists[data.progress],
          tasks: [taskId,...newState.lists[data.progress].tasks]
        }
      }

      newState.tasks =  {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], ...data }
      }

      return newState;
    }
    case 'delete_task': {
      const { taskId, listId } = action.payload;
      const newState = {
        ...state,
        tasks: removeObjectProperty(state.tasks, taskId),
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            tasks: state.lists[listId].tasks.filter(_id => _id !== taskId)
          }
        }
      }

      if (state.currentlyOpenedTask && taskId === state.currentlyOpenedTask._id) {
        newState.isCurrentlyOpenedTaskDeleted = true
      }

      return newState;
    }
    case 'add_comment': {
      const comment = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [comment.task]: {
            ...state.tasks[comment.task],
            comments: [comment, ...state.tasks[comment.task].comments],
            updatedAt: Date.now()
          }
        },
        currentlyOpenedTask: {
          ...state.currentlyOpenedTask,
          comments: [comment, ...state.currentlyOpenedTask.comments],
          updatedAt: Date.now()
        }
      }
    }
    case 'add_task_attachment': {
      const file = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [file.task]: {
            ...state.tasks[file.task],
            attachments: [...state.tasks[file.task].attachments, file],
            updatedAt: Date.now()
          }
        },
        currentlyOpenedTask: {
          ...state.currentlyOpenedTask,
          attachments: [...state.currentlyOpenedTask.attachments, file],
          updatedAt: Date.now()
        }
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
        },
        currentlyOpenedTask: {
          ...state.currentlyOpenedTask,
          attachments: state.currentlyOpenedTask.attachments.filter(attachment => attachment._id !== file._id),
          updatedAt: Date.now()
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
    case 'set_currently_opened_task':
      return {
        ...state,
        currentlyOpenedTask: action.payload
      }
    case 'remove_currently_opened_task': {
      return {
        ...state,
        isCurrentlyOpenedTaskDeleted: true
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
    case 'add_error':
      return {
        ...state,
        errorMessage: action.payload
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

export const MyTasksContext = React.createContext();

export const MyTasksProvider = ({ children }) => {
  const [myTasksState, dispatch] = useReducer(myTaskReducer, initialState);

  const fetchUserTasks = useCallback(async () => {
    const requestConfig = generateRequestConfig();
    dispatch({ type: 'fetching_mytasks' });

    if (requestConfig) {
      try {
        const response = await axios.get('/api/users/mytasks', requestConfig);
        const { tasks, tasksMap } = response.data;
        const { listsByProgressWithTaskIds, listsByProgressIds } = getGroupedListsData([], tasks);
        dispatch({
          type: 'fetch_mytasks', payload: {
            lists: listsByProgressWithTaskIds,
            listsOrder: listsByProgressIds,
            tasksCount: tasks.length,
            tasks: tasksMap
          }
        });
      } catch (err) {
        dispatch({ type: 'add_error', payload: err.response.data });
      }
    }
  }, [])

  const updateSingleList = list => {
    dispatch({ type: 'update_single_list', payload: list });
  }

  const updateMultipleLists = lists => {
    dispatch({ type: 'update_multiple_lists', payload: lists });
  }

  const deleteTaskFromMyTasks = useCallback(data => {
    dispatch({ type: 'delete_task', payload: data });
  }, [])

  const updateTaskInMyTasks = data => {
    dispatch({ type: 'update_task_attributes', payload: data });
  }

  const addCommentMyTasks = data => {
    dispatch({ type: 'add_comment', payload: data });
  }

  const addTaskAttachmentMyTasks = useCallback(data => {
    dispatch({ type: 'add_task_attachment', payload: data });
  }, [])

  const deleteTaskAttachmentMyTasks = useCallback(data => {
    dispatch({ type: 'delete_task_attachment', payload: data });
  }, [])

  const renameTaskAttachmentMyTasks = useCallback(data => {
    dispatch({ type: 'rename_attachment', payload: data });
  }, [])

  const toggleTaskCompletionMyTasks = data => {
    dispatch({ type: 'toggle_task_completion', payload: data });
  }

  const setMyTasksCurrentlyOpenedTask = task => {
    dispatch({ type: 'set_currently_opened_task', payload: task });
  }

  const removeMyTasksCurrentlyOpenedTask = useCallback(() => {
    dispatch({ type: 'remove_currently_opened_task' });
  }, [])

  const setMyTasksIsCurrentlyOpenedTaskDeleted = useCallback((value) => {
    dispatch({ type: 'set_is_currently_deleted', payload: value });
  }, [])

  const setMyTasksShowTaskDetails = (value) => {
    dispatch({ type: 'set_show_task_details', payload: value });
  }

  const addMyTasksError = useCallback(errorMessage => {
    dispatch({ type: 'add_error', payload: errorMessage });
  }, [])

  const clearMyTasksError = useCallback(() => {
    dispatch({ type: 'clear_error' });
  }, [])

  return (
    <MyTasksContext.Provider
      value={{
        myTasksState,
        fetchUserTasks,
        updateSingleList,
        updateMultipleLists,
        addMyTasksError,
        clearMyTasksError,
        deleteTaskFromMyTasks,
        updateTaskInMyTasks,
        toggleTaskCompletionMyTasks,
        setMyTasksCurrentlyOpenedTask,
        setMyTasksShowTaskDetails,
        removeMyTasksCurrentlyOpenedTask,
        setMyTasksIsCurrentlyOpenedTaskDeleted,
        addCommentMyTasks,
        addTaskAttachmentMyTasks,
        deleteTaskAttachmentMyTasks,
        renameTaskAttachmentMyTasks
      }}
    >
      {children}
    </MyTasksContext.Provider>
  );
}