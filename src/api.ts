import { API_URL } from './constants';
import axios from 'axios';

export const axiosConfig = axios.create({
  baseURL: API_URL,
  withCredentials: true
});
