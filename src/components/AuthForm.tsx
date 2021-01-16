import { Button, TextField } from '@material-ui/core';
import React, { ChangeEvent, Dispatch, FormEvent, useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import { postRequest } from '../api';
import { formDispatchAction, inputObj } from '../types';
import { FormWrapper } from './styled/Auth';

interface Props {
  initialState: Array<inputObj>;
  actionName: string;
  submit: (data: any, dispatch: Dispatch<formDispatchAction>) => void;
  postUrl: string;
  extraCredentials?: object;
}

function init(state: Array<inputObj>) {
  return state.map(o => ({
    name: o.name,
    value: '',
    id: o.id
  }));
}

export const AuthForm: React.FC<Props> = ({
  initialState,
  actionName,
  submit,
  postUrl,
  extraCredentials
}) => {
  const { state, dispatch } = useForm(initialState, init);

  const getValue = (name: string) =>
    state.find(o => o.name === name)?.value || '';

  const changeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    dispatch({ type: 'change', payload: e.target.value, target: name });
  };

  useEffect(() => {
    return () => {
      dispatch({ type: 'reset-all' });
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get user credentials
    let userCredentials = {};
    state.forEach(o => {
      userCredentials = { ...userCredentials, [o.id]: o.value };
    });
    if (extraCredentials) {
      userCredentials = { ...userCredentials, ...extraCredentials };
    }

    const data = await postRequest(postUrl, userCredentials);

    submit(data, dispatch);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormWrapper>
          <h2>{actionName}</h2>
          {initialState.map(o => (
            <TextField
              required
              key={o.id}
              type={o.type}
              label={o.name}
              value={getValue(o.name)}
              onChange={e => changeValue(e, o.name)}
              style={{ margin: '5px' }}
            />
          ))}
          <Button
            variant="contained"
            type="submit"
            disableElevation
            style={{ marginTop: '5px' }}>
            {actionName}
          </Button>
        </FormWrapper>
      </form>
    </>
  );
};
