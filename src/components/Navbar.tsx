import { AppBar } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer } from './styled/Auth';
import { ProtectedRoutes } from './ProtectedRoutes';

export const Navbar: React.FC<{}> = () => {
  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          <ProtectedRoutes />

          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
