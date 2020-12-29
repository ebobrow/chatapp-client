import { Button, Modal, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Dispatch, FormEvent, useState } from 'react';
import { API_URL } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
  refreshChats: () => Promise<void>;
}

interface person {
  found: boolean;
  name: string;
  type?: 'error' | null;
}

export const CreateChat: React.FC<Props> = ({ open, setOpen, refreshChats }) => {
  const [form, setForm] = useState('');
  const [people, setPeople] = useState<Array<person>>([]);
  const { user } = useAuthContext();

  const removePerson = (name: string) => {
    setPeople(curr => curr.filter(person => person.name !== name));
  };

  const addPerson = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/chat/finduser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: form })
    });
    const person: { user: object } = await res.json();

    setPeople(curr => [...curr, { found: !!person.user, name: form }]);
    setForm('');
  };

  const closeModal = () => {
    setPeople([]);
    setOpen(false);
  };

  const add = async () => {
    const validEmails = people.filter(person => person.found);
    if (!validEmails.length) return;
    const res = await fetch(`${API_URL}/chat/createchat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        users: [...validEmails.map(person => person.name), user?.email]
      })
    });
    const data = await res.json();

    if (!data.ok) {
      setPeople([{ name: data.error, found: false, type: 'error' }]);
      return;
    }
    refreshChats();
    closeModal();
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalForm onSubmit={addPerson}>
        <h1>New Chat</h1>
        {people.map((person, index) => {
          if (person.type === 'error') {
            return (
              <Alert
                key={index}
                style={{ margin: '5px' }}
                severity="error"
                onClose={_ => removePerson(person.name)}>
                {person.name}
              </Alert>
            );
          }
          return (
            <Alert
              key={person.name}
              style={{ margin: '5px' }}
              severity={person.found ? 'success' : 'error'}
              icon={false}
              onClose={_ => removePerson(person.name)}>
              {person.name}
              {!person.found && ' (not found)'}
            </Alert>
          );
        })}
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
        <Button variant="contained" color="secondary" onClick={add}>
          Create
        </Button>
      </ModalForm>
    </Modal>
  );
};