import React, { Dispatch, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { AuthError } from '../components/AuthError';
import { AuthForm } from '../components/AuthForm';
import { formDispatchAction, errorType } from '../types';
import { Title } from '../components/Title';

export const Profile: React.FC<{}> = () => {
  const { user, loggedIn, setUserToken } = useAuthContext();
  const [errors, setErrors] = useState<Array<string>>([]);
  const accountAge = new Date(
    (new Date() as any) - (new Date(user?.created_at!) as any)
  );

  const changePassword = async (
    data: any,
    dispatch: Dispatch<formDispatchAction>
  ) => {
    setErrors([]);

    if (!data.errors) {
      setUserToken(data.token);
      dispatch({ type: 'reset-all' });
    } else {
      data.errors.forEach((err: errorType) => {
        setErrors(c => [...c, err.message]);

        // Remove password if not valid
        if (err.target === 'newPasswordVerify') {
          dispatch({ type: 'reset', target: 'New Password' });
          dispatch({ type: 'reset', target: 'Confirm New Password' });
        }
      });
      setUserToken(data.token);
    }
  };

  return (
    <>
      <Title>Profile</Title>
      {!loggedIn && <Redirect to="/login" />}
      {user ? <h1>Hi, {user.name}</h1> : <h1>Loading...</h1>}
      <h3>Account Info</h3>
      <p>
        Created {accountAge.getUTCFullYear() - 1970} years,{' '}
        {accountAge.getUTCMonth()} months ago
      </p>
      <p>Username: {user?.username}</p>
      <AuthError messages={errors} setMessages={setErrors} />
      <AuthForm
        initialState={[
          { name: 'Current Password', type: 'password', id: 'oldPassword' },
          { name: 'New Password', type: 'password', id: 'newPassword' },
          {
            name: 'Confirm New Password',
            type: 'password',
            id: 'newPasswordVerify'
          }
        ]}
        actionName="Change Password"
        postUrl={'/auth/password'}
        submit={changePassword}
        extraCredentials={{ id: user?.id }}
      />
    </>
  );
};
