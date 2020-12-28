import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const Home: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <>
      {!loggedIn && <Redirect to="/login" />}
      <h1>Welcome to appname</h1>
    </>
  );
};
