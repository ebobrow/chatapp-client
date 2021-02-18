import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { SECONDARY_COLOR } from '../constants';
import { useLogOut } from '../hooks/useLogOut';
import { useUser } from '../hooks/useUser';
import { FlexContainer, StyledLink } from './styled/Auth';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from 'react-router-dom';
import { getErrorUrl } from '../api';

export const UserInfo: React.FC = () => {
  const history = useHistory();
  const { data: user, isLoading, error } = useUser();
  const [width, setWidth] = useState(window.innerWidth > 985 ? '15%' : '30%');
  const { mutate } = useLogOut();
  const queryClient = useQueryClient();

  const logOut = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        }
      }
    );
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

  if (error) {
    history.push(getErrorUrl(error));
  }

  if (user && !isLoading) {
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
