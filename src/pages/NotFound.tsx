import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

export const NotFound: React.FC<{}> = () => {
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>What's Appening | Not Found</title>
      </Helmet>
      <h1>404:</h1>
      <h4>
        <code>{location.pathname}</code> not found
      </h4>
    </>
  );
};
