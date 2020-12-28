import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Chat } from '../pages/Chat';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Profile } from '../pages/Profile';
import { SignUp } from '../pages/Signup';

export const Router: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" component={Profile} />
      <Route path="/chat" component={Chat} />
    </Switch>
  );
};
