import React, { Dispatch, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { ChatNameContainer, Check, EditName, ModalForm } from './styled/Chat';
import { useParticipants } from '../hooks/useParticipants';
import { useChatName } from '../hooks/useChatName';
import axios from 'axios';
import { Loading } from './Loading';
import { RefetchOptions, QueryObserverResult } from 'react-query';
import { ChatObject } from '../types';
import { useHistory } from 'react-router-dom';

interface Props {
  id: string;
  setId: Dispatch<string>;
  refetchChats: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<ChatObject[] | undefined, unknown>>;
}

export const ChatInfo: React.FC<Props> = ({ id, setId, refetchChats }) => {
  const history = useHistory();
  const {
    data: participants,
    isLoading: participantsLoading,
    isError: participantsError
  } = useParticipants(id);
  const {
    data: name,
    refetch: refetchName,
    isLoading: nameLoading,
    isError: chatError
  } = useChatName(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(name || '');

  if (participantsError || chatError) {
    history.push('/error');
  }

  const closeForm = () => {
    setEditing(false);
    setForm(name || '');
  };

  const handleSubmit = () => {
    axios
      .put(`/chat/name/${encodeURIComponent(id)}`, { name: form })
      .then(() => {
        refetchName();
        refetchChats();
      })
      .then(() => closeForm());
  };

  let content: JSX.Element;
  if (participantsLoading || nameLoading) {
    content = <Loading />;
  } else {
    content = (
      <>
        <ChatNameContainer>
          {editing ? (
            <>
              <TextField
                autoFocus
                value={form}
                onChange={e => setForm(e.target.value)}
                style={{ margin: '5px', width: '200px' }}
                onBlur={closeForm}
              />
              <Check onClick={handleSubmit} />
            </>
          ) : (
            <>
              <h1>{name ? name : 'No Name'}</h1>
              <EditName
                onClick={() => {
                  setEditing(true);
                  setForm(name || '');
                }}
              />
            </>
          )}
        </ChatNameContainer>
        <span>Members: {participants?.map(p => p.name).join(', ')}</span>
      </>
    );
  }

  return (
    <Modal open={!!id} onClose={() => setId('')}>
      <ModalForm
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}>
        {content}
      </ModalForm>
    </Modal>
  );
};
