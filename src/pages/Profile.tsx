import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthError } from '../components/AuthError';
import { Title } from '../components/Title';
import { Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { FormWrapper } from '../components/styled/Auth';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { catcher } from '../api';
import { Loading } from '../components/Loading';

const INPUTS = [
  { label: 'Current Password', name: 'oldPassword', type: 'password' },
  { label: 'New Password', name: 'newPassword', type: 'password' },
  { label: 'Confirm New Password', name: 'newPasswordVerify', type: 'password' }
];

const INITIAL_VALUES = {
  oldPassword: '',
  newPassword: '',
  newPasswordVerify: ''
};

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Required'),
  newPassword: Yup.string().required('Required'),
  newPasswordVerify: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Required')
});

const Profile: React.FC = () => {
  const { data: user, isLoading } = useUser();
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const accountAge = new Date(
    (new Date() as any) - (new Date(user?.created_at!) as any)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Title>Profile</Title>
      {user ? <h1>Hi, {user.name}</h1> : <Redirect to="/login" />}
      <h3>Account Info</h3>
      <p>
        Created {accountAge.getUTCFullYear() - 1970} years,{' '}
        {accountAge.getUTCMonth()} months ago
      </p>
      <p>Username: {user?.username}</p>
      <AuthError messages={authErrors} setMessages={setAuthErrors} />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={changePasswordSchema}
        onSubmit={async (values, formik) => {
          const res = await catcher<any>(async () => {
            const { data } = await axios.put('/auth/password', {
              ...values
            });
            return data;
          });

          setAuthErrors([]);
          if (res.errors) {
            res.errors.forEach((err: string) => {
              setAuthErrors(c => [...c, err]);
            });
            formik.setSubmitting(false);
          }
          formik.resetForm();
        }}>
        {({ isSubmitting }) => (
          <>
            <br />
            <Form>
              <FormWrapper>
                <h2>Change Password</h2>
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
                  Change Password
                </Button>
              </FormWrapper>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Profile;
