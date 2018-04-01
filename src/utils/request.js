import fetch from 'dva/fetch';
import sessionToken from './sessionToken';


function parseText(response) {
  return response.text();
}

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  debugger;
  if (200 <= response.status && 300 > response.status) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function getHeaders() {
  const token = sessionToken.get();
  if (token) {
    return {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      sessionToken: token,
    };
  } else {
    return {};
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, opts) {
  const headers = getHeaders();
  const options = Object.assign({}, {
    method: 'GET',
    mode: 'cors',
    headers,
  }, opts);

  return fetch(url, options)
    .then(checkStatus)
    .then(parseText)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
