import React from 'react';
import { LoadingContainer, Spinner } from './styled/Loading';

export const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  );
};
