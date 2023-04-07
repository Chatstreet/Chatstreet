import axios from 'axios';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const post = (url: string) => axios.create({
  baseURL: `${window.location.origin}${url}`,
  method: 'POST',
  timeout: 6000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  },
});

const get = (url: string) => axios.create({
  baseURL: `${window.location.origin}${url}`,
  method: 'GET',
  timeout: 6000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  },
});

export { post, get };
