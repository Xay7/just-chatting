import React from 'react';
import SignIn from './containers/SignIn/SignIn';
import SignUp from './containers/SignUp/SignUp';
import { Route, Switch } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import styles from './App.module.scss';

function App() {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
    </Switch>
  );
}

export default App;
