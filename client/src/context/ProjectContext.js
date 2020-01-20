import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { generateRequestConfig } from '../utils/helper';

const projectReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_projects':
      return {
        ...state,
        projects: action.payload,
        isLoading: false
      }
    case 'fetching_projects':
      return {
        ...state,
        isLoading: true
      }
    case 'create_project':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      }
    case 'delete_project':
      return {
        ...state,
        projects: [...state.projects].filter(project => project._id !== action.payload)
      }
    case 'add_project_error':
      return {
        ...state,
        errorMessage: action.payload
      }
    case 'clear_project_error_message':
      return {
        ...state,
        errorMessage: null
      }
    default:
      return state;
  }
}

export const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
  const [projectState, dispatch] = useReducer(projectReducer, {
    projects: [],
    errorMessage: null,
    isLoading: false
  });

  const fetchProjects = useCallback(async () => {
    const requestConfig = generateRequestConfig();
    if (requestConfig) {
      try {
        dispatch({ type: 'fetching_projects' });
        const response = await axios.get('/api/projects/all', requestConfig);
        dispatch({ type: 'fetch_projects', payload: response.data })
      } catch (err) {
        addProjectError(err.response.data)
      }
    }
  }, [])

  const createProject = async ({ projectName, projectDescription, isPublic }) => {
    const requestConfig = generateRequestConfig();

    const requestBody = {
      name: projectName,
      description: projectDescription,
      isPublic
    }

    if (requestConfig) {
      try {
        const response = await axios.post('/api/projects/create', JSON.stringify(requestBody), requestConfig);
        dispatch({ type: 'create_project', payload: response.data })
      } catch (err) {
        addProjectError(err.response.data)
      }
    }
  }

  const deleteProject = async _id => {
    const requestConfig = generateRequestConfig();

    if (requestConfig) {
      try {
        const response = await axios.delete(`/api/projects/${_id}`, requestConfig);
        dispatch({ type: 'delete_project', payload: response.data._id })
      } catch (err) {
        addProjectError(err.response.data)
      }
    }
  }

  const addProjectError = async (errorMessage) => {
    dispatch({ type: 'add_project_error', payload: errorMessage });
  }

  const clearProjectErrorMessage = () => {
    dispatch({ type: 'clear_project_error_message' });
  };

  return (
    <ProjectContext.Provider
      value={{ projectState, fetchProjects, createProject, deleteProject, addProjectError, clearProjectErrorMessage }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
