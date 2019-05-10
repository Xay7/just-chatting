import React from 'react';
import Login from './containers/Login/Login';
import { Route, Switch } from 'react-router-dom';
import styles from './App.module.scss';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
    </Switch>
  );
}

export default App;
