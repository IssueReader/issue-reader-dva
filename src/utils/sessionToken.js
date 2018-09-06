// import storage from './storage';
import localForage from 'localforage';
const sessionTokenKey = 'sessionToken';

export default {
  async get() {
    try {
      const token = await localForage.getItem(sessionTokenKey);
      return token;
    } catch (errMsg) {
      return null;
    }
  },
  set(sessionToken) {
    return localForage.setItem(sessionTokenKey, sessionToken);
  },
  remove() {
    return localForage.removeItem(sessionTokenKey);
  },
};
