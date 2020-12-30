import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';

export const Home: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      {!loggedIn && <Redirect to="/login" />}
      <h1>What's Appening</h1>
      <h4>What's app but worse.</h4>
    </>
  );
};
