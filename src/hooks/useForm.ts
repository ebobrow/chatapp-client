import { useReducer } from 'react';
import { formDispatchAction, inputObj } from '../types';

interface State {
  name: string;
  value: string;
  id: string;
}

function reducer(state: Array<State>, action: formDispatchAction) {
  switch (action.type) {
    case 'change':
      return state.map(o => {
        if (o.name === action.target) {
          return { name: o.name, value: action.payload, id: o.id };
        }
        return o;
      });
    case 'reset-all':
      return state.map(o => ({ name: o.name, value: '', id: o.id }));
    case 'reset':
      return state.map(o => {
        if (o.name === action.target) {
          return { name: o.name, value: '', id: o.id };
        }
        return o;
      });
    default:
      return state;
  }
}

export const useForm = (
  initialState: Array<inputObj>,
  init: (state: Array<inputObj>) => Array<State>
) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  return { state, dispatch };
};
