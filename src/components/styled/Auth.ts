import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormGroup, TextField } from '@material-ui/core';

export const ErrorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;

export const StyledLink = styled(Link)<{ hovercolor?: string }>`
  text-decoration: none;
  color: black;

  transition: color 0.4s ease;

  &:hover {
    color: ${({ hovercolor }) => (hovercolor ? hovercolor : 'black')};
  }
`;

export const NavContainer = styled.div`
  width: 90%;
  align-self: center;
  height: 10vh;
  min-height: 60px;
`;

export const FormWrapper = styled(FormGroup)`
  width: 40%;
  background-color: #fff;
  margin: auto;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

export const InputField = styled(TextField)`
  margin: 5px;
`;

export const FlexContainer = styled.div<{ width: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${({ width }) => (width ? width : '')};
  justify-content: space-between;
  height: 100%;
`;
