import { Button, Modal, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
  setRequests: (value: SetStateAction<string[]>) => void;
}

export const AddFriend: React.FC<Props> = ({ open, setOpen, setRequests }) => {
  const [form, setForm] = useState('');
  const [errors, setErrors] = useState<Array<string>>([]);

  const closeModal = () => {
    setErrors([]);
    setForm('');
    setOpen(false);
  };

  const closeAlert = (message: string) => {
    setErrors(curr => curr.filter(err => err !== message));
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();

    const { data } = await axios.post('/auth/friends/request', {
      reciever: form
    });

    if (!data.ok) {
      setErrors([data.error]);
      return;
    }

    setRequests(curr => [...curr, form]);
    closeModal();
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalForm onSubmit={add}>
        <h1>Add Friend</h1>
        {errors.map(err => (
          <Alert
            severity="error"
            style={{ margin: '5px' }}
            onClose={() => closeAlert(err)}
            key={err}>
            {err}
          </Alert>
        ))}
        <FlexFiller />
        <TextField
          autoFocus
          type="text"
          value={form}
          onChange={e => setForm(e.target.value)}
          label="Find user by username"
          style={{ margin: '10px' }}
        />
        <Button type="submit" variant="contained" color="secondary">
          Add
        </Button>
      </ModalForm>
    </Modal>
  );
};
