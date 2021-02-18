export interface errorType {
  message: string;
  target?: string | undefined;
}

export interface Message {
  sender: string;
  message: string;
}

export interface ChatObject {
  id: string;
  participants: string[];
  messages?: Message[];
  name?: string;
}

export interface Friend {
  name: string;
  username: string;
}

export interface ApiError {
  status: number;
  statusText: string;
  error: string;
  data?: object;
}
