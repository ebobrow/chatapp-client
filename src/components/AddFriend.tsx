import { Button, Modal, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import React, { Dispatch, FormEvent, useState } from 'react';
import { catcher } from '../api';
import { useSentRequests } from '../hooks/useSentRequests';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const AddFriend: React.FC<Props> = ({ open, setOpen }) => {
  const [form, setForm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const { refetch } = useSentRequests();

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

    const res = await catcher<any>(async () => {
      const { data } = await axios.post('/auth/friends/request', {
        reciever: form
      });
      return data;
    });

    if (!res || !res.ok) {
      setErrors([res.error]);
      return;
    }

    refetch();
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
