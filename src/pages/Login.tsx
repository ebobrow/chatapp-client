import React, { useState } from 'react';
import { AuthError } from '../components/AuthError';
import { Link, Redirect } from 'react-router-dom';
import { Title } from '../components/Title';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import { FormWrapper } from '../components/styled/Auth';
import { TextField } from 'formik-material-ui';
import { useUser } from '../hooks/useUser';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { catcher } from '../api';

const INPUTS = [
  { label: 'Username', name: 'username', type: 'text' },
  { label: 'Password', name: 'password', type: 'password' }
];

const INITIAL_VALUES = {
  username: '',
  password: ''
};

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required')
});

export const Login: React.FC = () => {
  const linkStyle: React.CSSProperties = {
    color: 'blue',
    textDecoration: 'none'
  };

  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();

  const [authErrors, setAuthErrors] = useState<string[]>([]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Title>Login</Title>
      {user && <Redirect to="/" />}
      <AuthError messages={authErrors} setMessages={setAuthErrors} />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={loginSchema}
        onSubmit={async (values, formik) => {
          const resetField = (fieldName: string) => {
            formik.setFieldValue(fieldName, '', false);
          };

          const res = await catcher<any>(async () => {
            const { data } = await axios.post('/auth/login', values);
            return data;
          });

          setAuthErrors([]);
          if (!res.errors) {
            queryClient.invalidateQueries();
            formik.resetForm();
          } else {
            res.errors.forEach((err: string) => {
              setAuthErrors(c => [...c, err]);
            });
            resetField('password');
            formik.setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => (
          <>
            <br />
            <Form>
              <FormWrapper>
                <h2>Login</h2>
                {INPUTS.map(input => (
                  <Field
                    key={input.name}
                    style={{ margin: '5px' }}
                    component={TextField}
                    label={input.label}
                    name={input.name}
                    type={input.type}
                  />
                ))}

                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  type="submit"
                  disableElevation
                  style={{ marginTop: '5px' }}>
                  Login
                </Button>
              </FormWrapper>
            </Form>
          </>
        )}
      </Formik>
      <br />
      <Link style={linkStyle} to="/signup">
        Don't have an account?
      </Link>
    </>
  );
};
