import React, { Dispatch, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { AuthError } from '../components/AuthError';
import { AuthForm } from '../components/AuthForm';
import { errorType, formDispatchAction } from '../types';
import { Title } from '../components/Title';

export const SignUp: React.FC<{}> = () => {
  const [errors, setErrors] = useState<Array<string>>([]);

  const { loggedIn, setUserToken } = useAuthContext();

  const signUpUser = async (data: any, dispatch: Dispatch<formDispatchAction>) => {
    setErrors([]);
    if (!data.errors) {
      setUserToken(data.token);
      dispatch({ type: 'reset-all' });
    } else {
      data.errors.forEach((err: errorType) => {
        setErrors(c => [...c, err.message]);

        // Remove email if not valid
        if (err.target === 'email') {
          dispatch({ type: 'reset', target: 'Email' });
        }

        // Remove name if not valid
        if (err.target === 'name') {
          dispatch({ type: 'reset', target: 'Name' });
        }
      });
      dispatch({ type: 'reset', target: 'Password' });
      dispatch({ type: 'reset', target: 'Confirm Password' });
    }
  };

  return (
    <>
      <Title>Sign Up</Title>
      <div>
        {loggedIn && <Redirect to="/" />}
        <AuthError messages={errors} setMessages={setErrors} />
        <AuthForm
          initialState={[
            { name: 'Name', type: 'text', id: 'name' },
            { name: 'Email', type: 'text', id: 'email' },
            { name: 'Password', type: 'password', id: 'password' },
            { name: 'Confirm Password', type: 'password', id: 'passwordVerify' }
          ]}
          actionName="Sign Up"
          postUrl={'/auth/register'}
          submit={signUpUser}
        />
      </div>
    </>
  );
};
