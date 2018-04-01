import fetch from 'dva/fetch';
import { getSessionToken } from './auth';


function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (200 <= response.status && 300 > response.status) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}


function ajax(url, opts, sessionToken) {
  const options = Object.assign({}, {
    method: 'GET',
    mode: 'cors',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      sessionToken,
    },
  }, opts);

  return fetch(url, options)
    .then(checkStatus)
    .then(parseText)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, opts) {
  return getSessionToken().then((sessionToken) => {
    return ajax(url, opts, sessionToken);
  }).catch(err => ({ err }));
}
