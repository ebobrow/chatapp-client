import React from 'react';
import { Redirect } from 'react-router-dom';
import { Title } from '../components/Title';
import { API_URL } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';

interface Props {}

export const Friends: React.FC<Props> = () => {
  const { user, loggedIn } = useAuthContext();

  const getFriendName = async (id: number) => {
    await fetch(`${API_URL}/`);
  };

  return (
    <>
      <Title>Friends</Title>
      {!loggedIn && <Redirect to="/login" />}
      <h1>Friends</h1>
      <div style={{ display: 'grid' }}>
        {user ? user.friends?.map(friend => <p>{friend}</p>) : 'Loading...'}
      </div>
    </>
  );
};
