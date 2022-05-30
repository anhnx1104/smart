const baseURL = process.env.REACT_APP_BASE_URL
  ? process.env.REACT_APP_BASE_URL
  : 'http://localhost:3000';

const version = process.env.REACT_APP_VERSION;
const client_params = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  grant_type: process.env.REACT_APP_GRANT_TYPE,
};

export { baseURL, version, client_params };
