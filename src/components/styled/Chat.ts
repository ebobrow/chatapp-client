import styled from 'styled-components';
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
  background-color: ${({ mymessage }) => (mymessage ? 'cornflowerblue' : 'gray')};
  padding: 5px 0;
  border-radius: 8px 8px ${({ mymessage }) => (mymessage ? '0 8px' : '8px 0')};
`;

export const MessageWrapper = styled.div<MessageProps>`
  grid-row: ${({ row }) => row + 1};
  grid-column: ${({ mymessage }) => (mymessage ? '3' : '1')} / span 1;
  display: flex;
  flex-direction: column;
  margin: 10px;

  p {
    margin: 0;
  }
`;

export const TextNode = styled.p<{ ismine: boolean }>`
  float: ${({ ismine }) => (ismine ? 'right' : 'left')};
  width: fit-content;
  padding: 3px 10px;
  text-align: ${({ ismine }) => (ismine ? 'right' : 'left')}; ;
`;

export const ChatWrapper = styled(FormWrapper)<{ w: string }>`
  width: ${({ w }) => w};
  margin: 10px;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  flex-wrap: nowrap;
`;
