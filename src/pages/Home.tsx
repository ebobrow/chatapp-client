import React from 'react';
import { Redirect } from 'react-router-dom';
import { Title } from '../components/Title';
import { useAuthContext } from '../contexts/AuthContext';

export const Home: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();

  return (
    <>
      <Title>Home</Title>
      {!loggedIn && <Redirect to="/login" />}
      <h1>What's Appening</h1>
      <h4>What's app but worse.</h4>
    </>
  );
};
