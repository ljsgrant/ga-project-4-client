import axios from 'axios';
import { AUTH } from './auth';

const ENDPOINTS = {
  allBirds: `${process.env.REACT_APP_BASE_URL}/api/birds/`,
  searchBirds: `${process.env.REACT_APP_BASE_URL} /api/birds/search/`,
  filterBirdSightings: `${process.env.REACT_APP_BASE_URL}/api/birds/filtersightings/`,
  singleBird: (pk) => `${process.env.REACT_APP_BASE_URL}/api/birds/${pk}/`,
  register: `${process.env.REACT_APP_BASE_URL}/api/user/register/`,
  login: `${process.env.REACT_APP_BASE_URL}/api/user/login/`,
  singleUser: (pk) => `${process.env.REACT_APP_BASE_URL}/api/user/${pk}/`,
  sightings: `${process.env.REACT_APP_BASE_URL}/api/sightings/`,
  singleSighting: (pk) =>
    `${process.env.REACT_APP_BASE_URL}/api/sightings/${pk}/`,
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
