import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthError } from '../components/AuthError';
import { Title } from '../components/Title';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { Formik, Form, Field } from 'formik';
import { FormWrapper } from '../components/styled/Auth';
import { TextField } from 'formik-material-ui';
import { useUser } from '../hooks/useUser';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { Loading } from '../components/Loading';
import { getErrorUrl } from '../api';

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

const SignUp: React.FC = () => {
  const history = useHistory();
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  } else if (user) {
    history.push('/');
  }

  return (
    <>
      <Title>Sign Up</Title>
      <AuthError messages={authErrors} setMessages={setAuthErrors} />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={SignUpSchema}
        onSubmit={async (values, formik) => {
          const resetField = (fieldName: string) => {
            formik.setFieldValue(fieldName, '', false);
          };

          setAuthErrors([]);

          try {
            await axios.post('/auth/register', values);

            queryClient.invalidateQueries();
            formik.resetForm();
          } catch (error) {
            if (error.status === 400) {
              setAuthErrors([error.error]);
              resetField('password');
              resetField('passwordVerify');
            } else {
              history.push(getErrorUrl(error));
            }
          } finally {
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

export default SignUp;
