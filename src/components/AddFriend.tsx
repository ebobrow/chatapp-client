import { Button, Modal, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { postRequest } from '../postRequest';
import { friend } from '../types';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
  setFriends: any; // How to get proper typing here?
}

export const AddFriend: React.FC<Props> = ({ open, setOpen, setFriends }) => {
  const [form, setForm] = useState('');
  const [errors, setErrors] = useState<Array<string>>([]);
  const { user } = useAuthContext();

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

    const data = await postRequest('/auth/friends/add', {
      email: form,
      id: user?.id
    });

    console.log(data);

    if (!data.ok) {
      setErrors([data.error]);
      return;
    }
    const { name, email }: { name: string; email: string } = data.friend;

    setFriends((curr: Array<friend>) => [...curr, { name, email }]);
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
          type="text"
          value={form}
          onChange={e => setForm(e.target.value)}
          label="Find user by email"
          style={{ margin: '10px' }}
        />
        <Button type="submit" variant="contained" color="secondary">
          Add
        </Button>
      </ModalForm>
    </Modal>
  );
};
