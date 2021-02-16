import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Error from '../pages/Error';
import NotFound from '../pages/NotFound';

const Chat = React.lazy(() => import('../pages/Chat'));
const Friends = React.lazy(() => import('../pages/Friends'));
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Profile = React.lazy(() => import('../pages/Profile'));
const SignUp = React.lazy(() => import('../pages/Signup'));

export const Router: React.FC = () => {
  return (
    <Switch>
      <Suspense fallback={<div>Loading...</div>}>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/friends" exact component={Friends} />
      </Suspense>
      <Route path="/error" component={Error} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
