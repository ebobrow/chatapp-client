import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { PRIMARY_COLOR } from '../../constants';

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
  overflow-y: scroll;
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
  min-width: fit-content;
  margin-top: 5px;

  p {
    margin: 0;
  }
`;

export const TextNode = styled.p<{ ismine: boolean; padding: boolean }>`
  float: ${({ ismine }) => (ismine ? 'right' : 'left')};
  padding: 3px ${({ padding }) => (padding ? '10px' : '0')};
  text-align: ${({ ismine }) => (ismine ? 'right' : 'left')};
`;

export const ChatWrapper = styled.div<{ w: string }>`
  width: ${({ w }) => w};
  margin: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  flex-wrap: nowrap;
`;

export const ConversationWrapper = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${({ active }) => (active ? '#fff' : '')};
  color: ${({ active }) => (active ? PRIMARY_COLOR : 'black')};
  box-shadow: ${({ active }) =>
    active ? '0 2px 8px 0 rgba(0, 0, 0, 0.2)' : ''};
  min-height: 50px;
  margin: 0 10px;
  padding: 10px;
  align-content: center;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    color: ${({ active }) => (active ? PRIMARY_COLOR : 'grey')};
    cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  }
`;

export const Plus = styled(AddIcon)`
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

export const ConversationListWrapper = styled.div<{ w: string; open: boolean }>`
  width: ${({ w }) => w};
  display: flex;
  flex-direction: column;
  border-right: ${({ open }) => (open ? '1px solid #969696' : 'none')};
  height: 95%;
  margin: 10px;
  min-width: fit-content;
`;

export const Hamburger = styled(MenuIcon)`
  width: 30px;
  height: 30px;
  margin: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const X = styled(CloseIcon)`
  width: 30px;
  height: 30px;
  margin: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const MessageForm = styled.form<{ atBottom: boolean }>`
  padding-bottom: 10px;
  border-radius: 3px;
  transition: box-shadow 0.1s ease;
  box-shadow: ${({ atBottom }) =>
    atBottom
      ? ''
      : `0px -2px 4px -1px rgba(0,0,0,0.2),
      0px -4px 5px 0px rgba(0,0,0,0.14),
      0px -1px 10px 0px rgba(0,0,0,0.12)`};
`;
