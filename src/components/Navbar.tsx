import { AppBar, ButtonGroup, Button } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer, StyledLink } from './StyledComponents';
import { useAuthContext } from '../contexts/AuthContext';

export const Navbar: React.FC<{}> = () => {
  const { loggedIn } = useAuthContext();
  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          <ButtonGroup color="primary" variant="contained" disableElevation>
            <Button>
              <StyledLink to="/">Home</StyledLink>
            </Button>
            {loggedIn && (
              <Button>
                <StyledLink to="/chat">Chat</StyledLink>
              </Button>
            )}
          </ButtonGroup>
          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
