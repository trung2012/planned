import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { getGroupedListsData, generateRequestConfig } from '../utils/helper';

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

      newState.lists[listId] = {
        ...newState.lists[listId],
        tasks: newState.lists[listId].tasks.filter(task => task._id !== newTask._id)
      }

      newState.lists[newTask.progress] = {
        ...newState.lists[newTask.progress],
        tasks: [newTask, ...newState.lists[newTask.progress].tasks]
      }

      return newState;
    }
    case 'update_task_attributes': {
      const { taskId, data } = action.payload;
      console.log(action.payload)
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...state.tasks[taskId], ...data }
        }
      }
    }
    case 'delete_task': {
      const { taskId, listId } = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            tasks: state.lists[listId].tasks.filter(task => task._id !== taskId)
          }
        }
      }
    }
    case 'unassign_task': {
      const { taskId, listId } = action.payload;

      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            tasks: state.lists[listId].tasks.filter(task => task._id !== taskId)
          }
        }
      }
    }
    case 'add_comment': {
      const { comment, listId } = action.payload;
      const newState = { ...state };
      const newList = { ...newState.lists[listId] };
      newList.tasks = newList.tasks.map(task => {
        if (task._id === comment.task) {
          return {
            ...task,
            comments: [comment, ...task.comments],
            updatedAt: Date.now()
          };
        } else {
          return task;
        }
      })
      newState.lists[listId] = newList;

      newState.currentlyOpenedTask = {
        ...state.currentlyOpenedTask,
        comments: [comment, ...state.currentlyOpenedTask.comments],
        updatedAt: Date.now()
      }

      return newState;
    }
    case 'add_task_attachment': {
      const { file, listId } = action.payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: {
            ...state.lists[listId],
            tasks: state.lists[listId].tasks.map(task => {
              if (task._id === file.task) {
                return {
                  ...task,
                  attachments: [task.attachments, file],
                  updatedAt: Date.now()
                }
              } else {
                return task;
              }
            })
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

  const toggleTaskCompletion = data => {
    dispatch({ type: 'toggle_task_completion', payload: data });
  }

  const unassignTaskInMyTasks = data => {
    dispatch({ type: 'unassign_task', payload: data });
  }

  const setMyTasksCurrentlyOpenedTask = task => {
    dispatch({ type: 'set_currently_opened_task', payload: task });
  }

  const removeMyTasksCurrentlyOpenedTask = useCallback(() => {
    dispatch({ type: 'remove_currently_opened_task' });
  }, [])

  const setMyTasksIsCurrentlyOpenedTaskDeleted = (value) => {
    dispatch({ type: 'set_is_currently_deleted', payload: value });
  }

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
        toggleTaskCompletion,
        unassignTaskInMyTasks,
        setMyTasksCurrentlyOpenedTask,
        setMyTasksShowTaskDetails,
        removeMyTasksCurrentlyOpenedTask,
        setMyTasksIsCurrentlyOpenedTaskDeleted,
        addCommentMyTasks,
        addTaskAttachmentMyTasks
      }}
    >
      {children}
    </MyTasksContext.Provider>
  );
}