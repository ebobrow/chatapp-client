import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';

export const FriendContainer = styled.div`
  background-color: gainsboro;
  width: 225px;
  height: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
  flex-direction: column;
`;

export const Plus = styled(AddIcon)`
  width: 15px;
  height: auto;
`;

export const FriendsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
