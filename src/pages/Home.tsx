import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Title } from '../components/Title';
import { useUser } from '../hooks/useUser';

const Home: React.FC = () => {
  const history = useHistory();
  const { data, isLoading, isError } = useUser();

  if (isError) {
    history.push('/error');
  }

  if (isLoading) {
    return <Loading />;
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
