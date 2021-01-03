import { FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import { PRIMARY_COLOR } from '../../constants';
import { FormWrapper } from './Auth';

interface MessageProps {
  row: number;
  mymessage: boolean;
}

const textWidth = 40;

export const MessagesContainer = styled.div`
  display: grid;
  grid-template-columns: ${textWidth}% ${100 - textWidth * 2}% ${textWidth}%;
  width: 100%;
  margin: auto;
`;

export const Message = styled.div<MessageProps>`
  background-color: ${({ mymessage }) =>
    mymessage ? 'cornflowerblue' : 'gray'};
  padding: 5px 0;
  border-radius: 8px 8px ${({ mymessage }) => (mymessage ? '0 8px' : '8px 0')};
`;

export const MessageWrapper = styled.div<MessageProps>`
  grid-row: ${({ row }) => row + 1};
  grid-column: ${({ mymessage }) => (mymessage ? '3' : '1')} / span 1;
  display: flex;
  flex-direction: column;
  margin: 10px;
  min-width: fit-content;

  p {
    margin: 0;
  }
`;

export const TextNode = styled.p<{ ismine: boolean; padding: boolean }>`
  float: ${({ ismine }) => (ismine ? 'right' : 'left')};
  padding: 3px ${({ padding }) => (padding ? '10px' : '0')};
  text-align: ${({ ismine }) => (ismine ? 'right' : 'left')};
`;

export const ChatWrapper = styled(FormWrapper)<{ w: string }>`
  width: ${({ w }) => w};
  margin: 10px;
  height: 93%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  flex-wrap: nowrap;
`;

export const ConversationWrapper = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ active }) => (active ? PRIMARY_COLOR : 'gainsboro')};
  min-height: 50px;
  margin-left: 10px;
  padding: 10px;
  align-content: center;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${({ active }) => (active ? PRIMARY_COLOR : 'grey')};
    cursor: pointer;
  }
`;

export const Plus = styled(FiPlus)`
  width: 30px;
  height: auto;
  margin: 20px 30px;

  &:hover {
    cursor: pointer;
  }
`;

export const ModalForm = styled.form`
  transform: translate(50%, 50%);
  background-color: white;
  width: 50%;
  height: 50%;
  outline: 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  overflow: scroll;
`;

export const FlexFiller = styled.div`
  flex-grow: 1;
`;

export const ConversationListWrapper = styled.div<{ w: string }>`
  width: ${({ w }) => w};
  display: flex;
  flex-direction: column;
  min-width: fit-content;
`;
