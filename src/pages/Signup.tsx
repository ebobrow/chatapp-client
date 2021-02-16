import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthError } from '../components/AuthError';
import { Title } from '../components/Title';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { FormWrapper } from '../components/styled/Auth';
import { TextField } from 'formik-material-ui';
import { useUser } from '../hooks/useUser';
import { useQueryClient } from 'react-query';
import axios from 'axios';

const INPUTS = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Username', name: 'username', type: 'text' },
  { label: 'Password', name: 'password', type: 'password' },
  { label: 'Confirm Password', name: 'passwordVerify', type: 'password' }
];

const INITIAL_VALUES = {
  name: '',
  username: '',
  password: '',
  passwordVerify: ''
};

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Too long')
    .matches(/^[a-zA-Z ]+$/, 'Invalid characters in name')
    .required('Required'),
  username: Yup.string().max(150, 'Too long').required('Required'),
  password: Yup.string().min(5, 'Too short').required('Required'),
  passwordVerify: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required')
});

export const SignUp: React.FC = () => {
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Title>Sign Up</Title>
      {user && <Redirect to="/" />}
      <AuthError messages={authErrors} setMessages={setAuthErrors} />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={SignUpSchema}
        onSubmit={async (values, formik) => {
          const resetField = (fieldName: string) => {
            formik.setFieldValue(fieldName, '', false);
          };

          const { data } = await axios.post('/auth/register', values);

          setAuthErrors([]);
          if (!data.errors) {
            queryClient.invalidateQueries();
            formik.resetForm();
          } else {
            data.errors.forEach((err: string) => {
              setAuthErrors(c => [...c, err]);
            });
            resetField('password');
            resetField('passwordVerify');
            formik.setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => (
          <>
            <br />
            <Form>
              <FormWrapper>
                <h2>Sign Up</h2>
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
                  Sign Up
                </Button>
              </FormWrapper>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
