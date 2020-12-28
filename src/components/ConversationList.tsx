import React from 'react';

interface Props {
  w: string;
}

export const ConversationList: React.FC<Props> = ({ w }) => {
  return (
    <div style={{ width: w }}>
      <h1>Conversations:</h1>
    </div>
  );
};
