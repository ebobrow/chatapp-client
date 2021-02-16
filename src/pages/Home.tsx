import React from 'react';
import { Redirect } from 'react-router-dom';
import { Title } from '../components/Title';
import { useUser } from '../hooks/useUser';

const Home: React.FC = () => {
  const { data, isLoading } = useUser();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Title>Home</Title>
      {!data && <Redirect to="/login" />}
      <h1>What's Appening</h1>
      <h4>What's app but worse.</h4>
    </>
  );
};

export default Home;
