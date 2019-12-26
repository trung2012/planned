import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import SignUp from './components/signup.component';
import SignIn from './components/signin.component';
import NavBar from './components/navbar.component'

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path='/' render={() => (<div>Home</div>)} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/signin' component={SignIn} />
        <Redirect to='/' />
      </Switch>
    </div>
  );
}

export default App;
