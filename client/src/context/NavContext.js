import React, { useReducer } from 'react';

const navReducer = (state, action) => {
  switch (action.type) {
    case 'resize_side_navbar':
      return {
        ...state,
        isSidebarCollapsed: !state.isSidebarCollapsed
      }
    default:
      return state;
  }
};

export const NavContext = React.createContext();

export const NavProvider = ({ children }) => {
  const [navState, dispatch] = useReducer(navReducer, {
    isSidebarCollapsed: false,
    sidebarWidth: 22.5,
    sidebarWidthCollapsed: 6
  });

  const resizeSideNavbar = () => {
    dispatch({ type: 'resize_side_navbar' });
  }

  return (
    <NavContext.Provider
      value={{
        navState,
        resizeSideNavbar
      }}>
      {children}
    </NavContext.Provider>
  );
};