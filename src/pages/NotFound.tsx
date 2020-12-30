import React from 'react';
import { useLocation } from 'react-router-dom';
import { Title } from '../components/Title';

export const NotFound: React.FC<{}> = () => {
  const location = useLocation();
  return (
    <>
      <Title>Not Found</Title>
      <h1>404:</h1>
      <h4>
        <code>{location.pathname}</code> not found
      </h4>
    </>
  );
};
