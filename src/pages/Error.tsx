import React from 'react';
import { useLocation } from 'react-router-dom';

export const Error: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);

  return (
    <div>
      <h1>Error | {query.get('status')}</h1>
      <p>{query.get('message')}</p>
    </div>
  );
};
