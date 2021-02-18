import React from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';
import { Loading } from '../components/Loading';
import { Title } from '../components/Title';
import { useUser } from '../hooks/useUser';

const Home: React.FC = () => {
  const history = useHistory();
  const { data, isLoading, error } = useUser();

  if (!data) {
    history.push('/login');
  }

  if (error) {
    history.push(getErrorUrl(error));
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Title>Home</Title>
      <h1>What's Appening</h1>
      <h4>What's app but worse.</h4>
    </>
  );
};

export default Home;
