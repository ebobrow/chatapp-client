import { AppBar } from '@material-ui/core';
import React, { Suspense } from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer } from './styled/Auth';
import { useUser } from '../hooks/useUser';

const ProtectedRoutes = React.lazy(() => import('./ProtectedRoutes'));

export const Navbar: React.FC = () => {
  const { data: user, isLoading } = useUser();

  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          {user && !isLoading ? (
            <Suspense fallback={<div></div>}>
              <ProtectedRoutes />
            </Suspense>
          ) : (
            <div></div>
          )}

          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
