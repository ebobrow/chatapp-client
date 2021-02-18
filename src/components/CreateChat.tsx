import React, { Dispatch, useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { FlexFiller, ModalForm } from './styled/Chat';
import axios from 'axios';
import { useFriends } from '../hooks/useFriends';
import { useConversations } from '../hooks/useConversations';
import { catcher } from '../api';
import { Loading } from './Loading';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

export const CreateChat: React.FC<Props> = ({ open, setOpen }) => {
  const [form, setForm] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { data: friends, isLoading } = useFriends();
  const { setChatId } = useChatContext();
  const { refetch } = useConversations();

  const removeError = (error: string) => {
    setErrors(curr => curr.filter(err => err !== error));
  };

  const closeModal = () => {
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
    const res = await catcher<any>(async () => {
      const { data } = await axios.post('/chat', {
        users: form
      });

      return data;
    });

    if (!res.ok) {
      setErrorsNoRepeats(res.error);
      return;
    }
    refetch();
    setChatId(res.id);
    closeModal();
  };

  if (isLoading) {
    return <Loading />;
  }

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

        <FlexFiller />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <Autocomplete
            multiple
            options={friends || []}
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
              <TextField
                autoFocus
                {...params}
                label="Add friend"
                value={form}
              />
            )}
            onChange={(_e, value) => {
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
