import styled, { css, keyframes } from 'styled-components';
import { PRIMARY_COLOR } from '../../constants';

const spin = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
`;

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${PRIMARY_COLOR};
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: ${css`
    ${spin} 0.7s linear 0s infinite
  `};
`;
