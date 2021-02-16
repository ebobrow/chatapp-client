import React from 'react';
import { useLocation } from 'react-router-dom';

export const Error: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);

  return (
    <div>
      <h1>Error | {query.get('status') || 500}</h1>
      <p>{query.get('message') || 'Something went wrong'}</p>
    </div>
  );
};
