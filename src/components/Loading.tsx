import React from 'react';
import { LoadingContainer } from './styled/Loading';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <CircularProgress />
    </LoadingContainer>
  );
};
