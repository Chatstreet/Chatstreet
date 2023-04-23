import axios from 'axios';

let baseUrl = '';

if (process.env.NODE_ENV === 'development') {
  baseUrl += 'http://localhost:80';
}

axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

const post = (url: string) => axios.create({
  baseURL: `${baseUrl}${url}`,
  method: 'POST',
  timeout: 6000,
  headers: {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  },
  withCredentials: true,
});

const get = (url: string) => axios.create({
  baseURL: `${baseUrl}${url}`,
  method: 'GET',
  timeout: 6000,
  headers: {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  },
  withCredentials: true,
});

export { post, get };
