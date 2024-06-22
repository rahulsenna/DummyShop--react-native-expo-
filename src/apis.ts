import axios from 'axios';
// import { Item } from '@/src/types/';

axios.defaults.baseURL = 'https://dummyjson.com/';

interface AuthResponse {
  token: string;
}
import { User } from '@/app/(tabs)/(auth)/profile'
// interface ItemsResponse {
//   items: Item[];
//   totalPages: number
// }

export const register = async (userid: string, password: string): Promise<void> => {
  await axios.post(`users/register`, { username:userid, password:password });
};

export const login = async (userid: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`auth/login`, { username:userid, password:password });  
  return response.data;
};

export const getUser = async (token: string): Promise<User> => {
  const response = await axios.get('auth/me', { headers: { 'Authorization': `Bearer ${token}`, } });
  return await response.data;
};


export const setAuthToken = async (token: string) : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = token;
}

export const removeAuthToken = async () : Promise<void> =>{
  axios.defaults.headers.common['Authorization'] = '';
}
