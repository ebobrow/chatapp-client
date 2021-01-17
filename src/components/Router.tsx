import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Chat } from '../pages/Chat';
import { Friends } from '../pages/Friends';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { Profile } from '../pages/Profile';
import { SignUp } from '../pages/Signup';

export const Router: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/chat" exact component={Chat} />
      <Route path="/friends" exact component={Friends} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
