import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, ...rest }) => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() => {
        if (authState.token) {
          return children;
        }

        return (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location }
            }}
          />);
      }}
    />
  );
}

export default PrivateRoute;