import React, { useContext, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import SignUp from './components/signup.component';
import SignIn from './components/signin.component';
import NavBar from './components/navbar.component'
import ProjectOverview from './components/project-overview.component'
import PrivateRoute from './components/private-route.component';
import ProjectDetails from './components/project-details.component';
import SideNavbar from './components/side-navbar.component';
import MyTasks from './components/my-tasks.component';

import './App.css';

const App = () => {
  const history = useHistory();
  const { loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser(() => history.push('/signin'));
  }, [loadUser, history])

  return (
    <div className="App">
      <NavBar />
      <div className='app-main-content'>
        <Switch>
          <PrivateRoute path='/projects/:projectId'>
            <SideNavbar />
            <ProjectDetails />
          </PrivateRoute>
          <PrivateRoute path='/mytasks'>
            <SideNavbar />
            <MyTasks />
          </PrivateRoute>
          <PrivateRoute exact path='/home'>
            <SideNavbar />
            <ProjectOverview />
          </PrivateRoute>
          <PrivateRoute exact path='/'>
            <SideNavbar />
            <ProjectOverview />
          </PrivateRoute>
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/signin' component={SignIn} />
          <Redirect to='/' />
        </Switch>
      </div>
    </div>
  );
}

export default App;
