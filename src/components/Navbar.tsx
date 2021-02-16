import { AppBar } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer } from './styled/Auth';
import { ProtectedRoutes } from './ProtectedRoutes';
import { useUser } from '../hooks/useUser';

export const Navbar: React.FC = () => {
  const { data: user, isLoading } = useUser();

  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          {user && !isLoading ? <ProtectedRoutes /> : <div></div>}

          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
