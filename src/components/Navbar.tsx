import React, { Suspense } from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer } from './styled/Auth';
import { useUser } from '../hooks/useUser';
import AppBar from '@material-ui/core/AppBar';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';

const ProtectedRoutes = React.lazy(() => import('./ProtectedRoutes'));

export const Navbar: React.FC = () => {
  const history = useHistory();
  const { data: user, isLoading, error } = useUser();

  if (error) {
    history.push(getErrorUrl(error));
  }

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
