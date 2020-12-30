import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { APP_NAME } from '../constants';

export const NotFound: React.FC<{}> = () => {
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Not Found</title>
      </Helmet>
      <h1>404:</h1>
      <h4>
        <code>{location.pathname}</code> not found
      </h4>
    </>
  );
};
