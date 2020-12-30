import { Button } from '@material-ui/core';
import React from 'react';
import { AddChat, FriendContainer, Plus } from './styled/Friends';

interface Props {
  name: string;
}

export const Friend: React.FC<Props> = ({ name }) => {
  return (
    <FriendContainer>
      <strong>{name}</strong>
      <Button color="primary" variant="outlined">
        Chat <Plus />
      </Button>
    </FriendContainer>
  );
};
