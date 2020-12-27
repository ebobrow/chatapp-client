import { AppBar, ButtonGroup, Button } from '@material-ui/core';
import React from 'react';
import { UserInfo } from './UserInfo';
import { FlexContainer, NavContainer, StyledLink } from './StyledComponents';

export const Navbar: React.FC<{}> = () => {
  return (
    <AppBar position="relative" color="primary">
      <NavContainer>
        <FlexContainer width="100%">
          <ButtonGroup color="primary" variant="contained" disableElevation>
            <Button>
              <StyledLink to="/">Home</StyledLink>
            </Button>
          </ButtonGroup>
          <UserInfo />
        </FlexContainer>
      </NavContainer>
    </AppBar>
  );
};
