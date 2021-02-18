import React, { useState } from 'react';
import { AuthError } from '../components/AuthError';
import { Link, useHistory } from 'react-router-dom';
import { Title } from '../components/Title';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { FormWrapper } from '../components/styled/Auth';
import { TextField } from 'formik-material-ui';
import { useUser } from '../hooks/useUser';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { Loading } from '../components/Loading';

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

const Login: React.FC = () => {
  const linkStyle: React.CSSProperties = {
    color: 'blue',
    textDecoration: 'none'
  };

  const queryClient = useQueryClient();
  const history = useHistory();
  const { data: user, isLoading, isError } = useUser();

  const [authErrors, setAuthErrors] = useState<string[]>([]);

  if (user) {
    history.push('/');
  }

  if (isError) {
    history.push('/error');
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Title>Login</Title>
      <AuthError messages={authErrors} setMessages={setAuthErrors} />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={loginSchema}
        onSubmit={async (values, formik) => {
          const resetField = (fieldName: string) => {
            formik.setFieldValue(fieldName, '', false);
          };

          const { data } = await axios.post('/auth/login', values);

          setAuthErrors([]);
          if (!data.errors) {
            queryClient.invalidateQueries();
            formik.resetForm();
          } else {
            data.errors.forEach((err: string) => {
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

export default Login;
