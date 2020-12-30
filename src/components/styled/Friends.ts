import { FiPlus } from 'react-icons/fi';
import styled from 'styled-components';

export const FriendContainer = styled.div`
  background-color: gainsboro;
  transition: background-color 0.3s ease;
  width: 200px;
  height: 75px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
  flex-direction: column;
`;

export const Plus = styled(FiPlus)`
  width: 15px;
  height: auto;
`;

export const AddChat = styled.div`
  background-color: #51a268;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40%;
  height: 40%;
  border-radius: 5px;

  &:hover {
    background-color: #387048;
    cursor: pointer;
  }
`;
