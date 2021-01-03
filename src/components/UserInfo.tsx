import { Button, ButtonGroup } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { SECONDARY_COLOR } from '../constants';
import { useAuthContext } from '../contexts/AuthContext';
import { FlexContainer, StyledLink } from './styled/Auth';

export const UserInfo: React.FC<{}> = () => {
  const { loggedIn, user, setUserToken } = useAuthContext();
  const [width, setWidth] = useState(window.innerWidth > 985 ? '15%' : '30%');

  const logOut = () => {
    setUserToken(null);
  };

  const setWidthCallback = useCallback(() => {
    setWidth(window.innerWidth > 985 ? '15%' : '30%');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setWidthCallback);

    return () => {
      window.removeEventListener('resize', setWidthCallback);
    };
  }, [setWidthCallback]);

  if (loggedIn && user) {
    return (
      <FlexContainer width={width}>
        <StyledLink to="/profile" hovercolor={SECONDARY_COLOR}>
          {user.name}
        </StyledLink>
        <Button
          variant="contained"
          color="secondary"
          onClick={logOut}
          disableElevation>
          Log Out
        </Button>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer width={width}>
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
