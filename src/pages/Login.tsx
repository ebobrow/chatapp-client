import React, { Dispatch, useState } from 'react';
import { AuthError } from '../components/AuthError';
import { useAuthContext } from '../contexts/AuthContext';
import { Link, Redirect } from 'react-router-dom';
import { errorType, formDispatchAction } from '../types';
import { AuthForm } from '../components/AuthForm';
import { Title } from '../components/Title';

export const Login: React.FC<{}> = () => {
  const linkStyle: React.CSSProperties = {
    color: 'blue',
    textDecoration: 'none'
  };

  const { loggedIn, setUserToken } = useAuthContext();

  const [errors, setErrors] = useState<Array<string>>([]);

  const loginUser = async (data: any, dispatch: Dispatch<formDispatchAction>) => {
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
        dispatch({ type: 'reset', target: 'Password' });
      });
    }
  };

  return (
    <>
      <Title>Login</Title>
      <div>
        {loggedIn && <Redirect to="/" />}
        <AuthError messages={errors} setMessages={setErrors} />
        <AuthForm
          initialState={[
            { name: 'Email', type: 'text', id: 'email' },
            { name: 'Password', type: 'password', id: 'password' }
          ]}
          actionName="Log In"
          submit={loginUser}
          postUrl={'/auth/login'}
        />
        <br />
        <Link style={linkStyle} to="/signup">
          Don't have an account?
        </Link>
      </div>
    </>
  );
};
