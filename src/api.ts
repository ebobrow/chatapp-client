import { API_URL } from './constants';

export const postRequest = async (url: string, body: object) => {
  const res = await fetch(API_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data;
};
