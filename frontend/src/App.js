import React from 'react';
import SignIn from './containers/SignIn/SignIn';
import SignUp from './containers/SignUp/SignUp';
import Chat from './containers/Chat/Chat';
import { Route, Switch } from 'react-router-dom';
import AuthGuard from './hoc/AuthGuard';
import Main from './containers/Main/Main';
// eslint-disable-next-line no-unused-vars
import styles from './App.module.scss';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/chat" component={AuthGuard(Chat)} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/room/:id" component={SignUp} />
    </Switch>
  );
}

export default App;
