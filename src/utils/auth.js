import storage from './storage';


export default {
  getSessionToken() {
    debugger;
    return new Promise((resolve, reject) => {
      const error = new Error('Unauthorized');
      error.response = { status: 403 };
      const sessionToken = storage.get('sessionToken');
      if (sessionToken) {
        return resolve(sessionToken);
      } else {
        return reject(error);
      }
    });
  },
  setSessionToken(sessionToken) {
    return new Promise((resolve) => {
      storage.set('sessionToken', sessionToken);
      return resolve(sessionToken);
    });
  },
  removeSessionToken() {
    return new Promise((resolve) => {
      const sessionToken = storage.remove('sessionToken');
      return resolve(sessionToken);
    });
  },
};
