import { Button, Modal, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Dispatch, FormEvent, useState } from 'react';
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
  name: string;
}

export const CreateChat: React.FC<Props> = ({ open, setOpen, refreshChats }) => {
  const [form, setForm] = useState('');
  const [people, setPeople] = useState<Array<person>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const { user } = useAuthContext();

  const removePerson = (name: string) => {
    setPeople(curr => curr.filter(person => person.name !== name));
  };

  const removeError = (error: string) => {
    setErrors(curr => curr.filter(err => err !== error));
  };

  const addPerson = async (e: FormEvent) => {
    e.preventDefault();
    const person = await postRequest('/chat/finduser', { email: form });

    setPeople(curr => [...curr, { found: !!person.user, name: form }]);
    setForm('');
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
    const validEmails = people.filter(person => person.found);
    if (!validEmails.length) return;
    if (validEmails.find(person => person.name === user?.email)) {
      setErrorsNoRepeats('Cannot add self to chat');
      return;
    }

    const data = await postRequest('/chat/createchat', {
      users: [...validEmails.map(person => person.name), user?.email]
    });

    if (!data.ok) {
      setErrorsNoRepeats(data.error);
      return;
    }
    refreshChats();
    closeModal();
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalForm onSubmit={addPerson}>
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
            key={`email-${index}`}
            style={{ margin: '5px' }}
            severity={person.found ? 'success' : 'error'}
            icon={false}
            onClose={() => removePerson(person.name)}>
            {person.name}
            {!person.found && ' (not found)'}
          </Alert>
        ))}
        <FlexFiller />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <TextField
            type="text"
            value={form}
            onChange={e => setForm(e.target.value)}
            label="Add user email"
            style={{ margin: '10px', width: '100%' }}
          />
          <Button
            variant="contained"
            disableElevation
            style={{ margin: '10px' }}
            type="submit">
            Add
          </Button>
        </div>
        <Button variant="contained" color="secondary" onClick={create}>
          Create
        </Button>
      </ModalForm>
    </Modal>
  );
};
