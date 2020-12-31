export interface errorType {
  message: string;
  target?: string | undefined;
}

export interface inputObj {
  name: string;
  type: 'password' | 'text';
  id: string;
}

export type formDispatchAction =
  | {
      type: 'change';
      target: string;
      payload: string;
    }
  | { type: 'reset'; target: string }
  | { type: 'reset-all' };

export type ChatObject = {
  id: string;
  participants: Array<string>;
  messages?: Array<object>;
};

export interface friend {
  name: string;
  email: string;
}
