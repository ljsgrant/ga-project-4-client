import axios from 'axios';
import { AUTH } from './auth';

const ENDPOINTS = {
  allBirds: '/api/birds/',
  searchBirds: '/api/birds/search/',
  singleBird: (pk) => `/api/birds/${pk}/`,
  register: '/api/auth/register/',
  login: '/api/auth/login/',
  sightings: '/api/sightings/'
};

const GET = (endpoint) => axios.get(endpoint);
const POST = (endpoint, body, headers) =>
  headers ? axios.post(endpoint, body, headers) : axios.post(endpoint, body);
const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${AUTH.getToken()}` }
});

export const API = { ENDPOINTS, GET, POST, PUT, DELETE, getHeaders };
