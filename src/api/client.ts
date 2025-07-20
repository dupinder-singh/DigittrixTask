import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
  'x-api-key': 'reqres-free-v1'
  },
});

export default apiClient;