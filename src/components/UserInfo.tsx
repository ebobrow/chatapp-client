import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { FlexContainer, StyledLink } from './styled/Auth';

export const UserInfo: React.FC<{}> = () => {
  const { loggedIn, user, setUserToken } = useAuthContext();

  const logOut = () => {
    setUserToken(null);
  };

  if (loggedIn && user) {
    return (
      <FlexContainer width="15%">
        <StyledLink to="/profile" hovercolor="#B55855">
          {user.name}
        </StyledLink>
        <Button variant="contained" color="secondary" onClick={logOut}>
          Log Out
        </Button>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer width="20%">
      <ButtonGroup color="primary" variant="contained" disableElevation>
        <Button>
          <StyledLink to="/login">Login</StyledLink>
        </Button>
        <Button>
          <StyledLink to="/signup">Sign up</StyledLink>
        </Button>
      </ButtonGroup>
    </FlexContainer>
  );
};
