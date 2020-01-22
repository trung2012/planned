import React, { useCallback, useReducer } from 'react';
import axios from 'axios';

import { generateRequestConfig } from '../utils/helper';

const projectReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_projects':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
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
    case 'add_project_to_favorites':
      return {
        ...state,
        favoriteProjects: [...state.favoriteProjects, action.payload],
        favoriteProjectIds: [...state.favoriteProjects, action.payload._id]
      }
    case 'remove_project_from_favorites':
      return {
        ...state,
        favoriteProjects: state.favoriteProjects.filter(project => project._id !== action.payload),
        favoriteProjectIds: state.favoriteProjectIds.filter(projectId => projectId !== action.payload)
      }
    case 'delete_project':
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload)
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
    favoriteProjects: [],
    favoriteProjectIds: [],
    errorMessage: null,
    isLoading: false
  });

  const fetchProjects = useCallback(async () => {
    const requestConfig = generateRequestConfig();
    if (requestConfig) {
      try {
        dispatch({ type: 'fetching_projects' });
        const response = await axios.get('/api/projects/all', requestConfig);
        dispatch({ type: 'fetch_projects', payload: response.data });
      } catch (err) {
        addProjectError(err.response.data);
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

  const addProjectToFavorites = async project => {
    const requestConfig = generateRequestConfig();

    if (requestConfig) {
      try {
        const response = await axios.post('/api/projects/favorite/add', JSON.stringify({ project }), requestConfig);
        dispatch({ type: 'add_project_to_favorites', payload: response.data })
      } catch (err) {
        addProjectError(err.response.data);
      }
    }
  }

  const removeProjectFromFavorites = async projectId => {
    const requestConfig = generateRequestConfig();

    if (requestConfig) {
      dispatch({ type: 'remove_project_from_favorites', payload: projectId });

      try {
        await axios.post('/api/projects/favorite/remove', JSON.stringify({ projectId }), requestConfig);
      } catch (err) {
        addProjectError(err.response.data);
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

  const addProjectError = async errorMessage => {
    dispatch({ type: 'add_project_error', payload: errorMessage });
  }

  const clearProjectErrorMessage = useCallback(() => {
    dispatch({ type: 'clear_project_error_message' });
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projectState,
        fetchProjects,
        createProject,
        deleteProject,
        addProjectError,
        clearProjectErrorMessage,
        addProjectToFavorites,
        removeProjectFromFavorites
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
