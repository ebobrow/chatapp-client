export interface errorType {
  message: string;
  target?: string | undefined;
}

export type ChatObject = {
  id: string;
  participants: Array<string>;
  messages?: Array<{ sender: string; message: string }>;
};

export interface friend {
  name: string;
  username: string;
}

export interface FriendRequest {
  id: number;
  sender: string;
  reciever: string;
  seen: boolean;
}
