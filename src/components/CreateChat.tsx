import { Button, Modal, TextField } from '@material-ui/core';
import { Alert, AlertTitle, Autocomplete } from '@material-ui/lab';
import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { postRequest } from '../postRequest';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
  refreshChats: () => Promise<void>;
}

interface person {
  found: boolean;
  name?: string;
  username: string;
}

interface friend {
  name: string;
  username: string;
}

export const CreateChat: React.FC<Props> = ({
  open,
  setOpen,
  refreshChats
}) => {
  const [form, setForm] = useState<Array<string>>([]);
  const [people, setPeople] = useState<Array<person>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [friends, setFriends] = useState<Array<friend>>([]);
  const { user } = useAuthContext();

  const getFriendNames = useCallback(async () => {
    if (!user) return;
    const data = await postRequest('/auth/friends/getnames', {
      ids: user.friends
    });
    setFriends(data.names);
  }, [user]);

  const removePerson = (username: string) => {
    setPeople(curr => curr.filter(person => person.username !== username));
  };

  const removeError = (error: string) => {
    setErrors(curr => curr.filter(err => err !== error));
  };

  const closeModal = () => {
    setPeople([]);
    setErrors([]);
    setOpen(false);
  };

  const setErrorsNoRepeats = (error: string) => {
    setErrors(curr => {
      if (curr.find(err => err === error)) return curr;
      return [...curr, error];
    });
  };

  const create = async () => {
    const data = await postRequest('/chat/createchat', {
      users: [...form, user?.username]
    });

    if (!data.ok) {
      setErrorsNoRepeats(data.error);
      return;
    }
    refreshChats();
    closeModal();
  };

  useEffect(() => {
    getFriendNames();
  }, [getFriendNames]);

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalForm
        onSubmit={e => {
          e.preventDefault();
          create();
        }}>
        <h1>New Chat</h1>
        {errors.map((err, index) => (
          <Alert
            key={`err-${index}`}
            style={{ margin: '5px' }}
            severity="error"
            onClose={() => removeError(err)}>
            {err}
          </Alert>
        ))}
        {people.map((person, index) => (
          <Alert
            key={`username-${index}`}
            style={{ margin: '5px' }}
            severity={person.found ? 'success' : 'error'}
            icon={false}
            onClose={() => removePerson(person.username)}>
            <AlertTitle>{person.found ? person.name : 'Not Found'}</AlertTitle>
            {person.username}
          </Alert>
        ))}

        <FlexFiller />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <Autocomplete
            multiple
            options={friends}
            getOptionLabel={option => option.username}
            getOptionSelected={(option, value) =>
              option.username === value.username
            }
            style={{ margin: '10px', width: '100%' }}
            renderOption={option => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>{option.name}</strong>
                <small>{option.username}</small>
              </div>
            )}
            renderInput={params => (
              <TextField {...params} label="Add friend" value={form} />
            )}
            onChange={(_e, value) => {
              console.log(value);

              setForm(value ? value.map(user => user.username) : []);
            }}
          />
        </div>
        <Button variant="contained" color="secondary" onClick={create}>
          Create
        </Button>
      </ModalForm>
    </Modal>
  );
};
