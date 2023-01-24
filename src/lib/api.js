import axios from 'axios';
import { AUTH } from './auth';

const ENDPOINTS = {
  allBirds: '/api/birds/',
  searchBirds: '/api/birds/search/',
  singleBird: (pk) => `/api/birds/${pk}/`,
  register: '/api/user/register/',
  login: '/api/user/login/',
  singleUser: (pk) => `/api/user/${pk}/`,
  sightings: '/api/sightings/',
  singleSighting: (pk) => `/api/sightings/${pk}`,
  cloudinary: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
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
