import axios from 'axios';

const ENDPOINTS = {
  allBirds: '/api/birds/',
  singleBird: (pk) => `/api/birds/${pk}/`,
  register: '/api/auth/register/',
  login: '/api/auth/login/'
};

const GET = (endpoint) => axios.get(endpoint);
const POST = (endpoint, body, headers) =>
  headers ? axios.post(endpoint, body, headers) : axios.post(endpoint, body);
const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

export const API = { ENDPOINTS, GET, POST, PUT, DELETE };
