import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const Error: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);

  return (
    <div>
      <Helmet>
        <title>Something went wrong...</title>
      </Helmet>
      <h1>
        {query.get('status')} | {query.get('status-text')}
      </h1>
      <p>{query.get('message')}</p>
    </div>
  );
};

export default Error;
