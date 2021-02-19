import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import React, { Dispatch, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';
import { useSentRequests } from '../hooks/useSentRequests';
import { FlexFiller, ModalForm } from './styled/Chat';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const AddFriend: React.FC<Props> = ({ open, setOpen }) => {
  const history = useHistory();
  const [form, setForm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const { refetch } = useSentRequests();

  const reset = (closeModal = false) => {
    setErrors([]);
    setForm('');
    setOpen(!closeModal);
  };

  const closeAlert = (message: string) => {
    setErrors(curr => curr.filter(err => err !== message));
  };

  const add = (e: FormEvent) => {
    e.preventDefault();
    reset();

    axios
      .post('/friends/request', {
        reciever: form
      })
      .then(() => {
        refetch();
        reset(true);
      })
      .catch(error => {
        if (error.status === 400) {
          setErrors([error.error]);
        } else {
          history.push(getErrorUrl(error));
        }
      });
  };

  return (
    <Modal open={open} onClose={() => reset(true)}>
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
