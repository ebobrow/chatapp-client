import React, { Dispatch } from 'react';
import { ErrorContainer } from './styled/Auth';
import { Alert } from '@material-ui/lab';

interface Props {
  messages: Array<string>;
  setMessages: Dispatch<Array<string>>;
}

export const AuthError: React.FC<Props> = ({ messages, setMessages }) => {
  const closeError = (m: string) => {
    const newMessages = messages.filter(message => message !== m);
    setMessages(newMessages);
  };

  return (
    <ErrorContainer>
      {messages.map(err => (
        <Alert
          severity="error"
          key={err}
          style={{ margin: '5px', width: '40%' }}
          onClose={() => closeError(err)}>
          {err}
        </Alert>
      ))}
    </ErrorContainer>
  );
};
