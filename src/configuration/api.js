import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://louvoursheknah-api.herokuapp.com/',
  baseURL: 'http://ec2-13-58-102-164.us-east-2.compute.amazonaws.com:8080/',
});

export default api;
