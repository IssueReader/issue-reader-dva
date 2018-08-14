// import storage from './storage';
import localForage from 'localforage';
const accessTokenKey = 'accessToken';

export default {
  async get() {
    try {
      const token = await localForage.getItem(accessTokenKey);
      return token;
    } catch (errMsg) {
      return null;
    }
  },
  set(token) {
    return localForage.setItem(accessTokenKey, token);
  },
  remove() {
    return localForage.removeItem(accessTokenKey);
  },
};
