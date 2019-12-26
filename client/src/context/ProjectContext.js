import React, { useCallback, useReducer } from 'react';
import axios from 'axios';


export const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    projects: [],
    errorMessage: null
  });

  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const requestConfig = {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }

        const response = await axios.get('/api/projects/all', requestConfig);
        dispatch({ type: 'fetch_projects', payload: response.data })
      } catch (err) {
        dispatch({ type: 'add_project_error', payload: err.response.data })
      }
    }
  }, [])

  return (
    <ProjectContext.Provider value={{ state, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};


const projectReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_projects':
      return {
        ...state,
        projects: action.payload
      }
    case 'add_project_error':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}