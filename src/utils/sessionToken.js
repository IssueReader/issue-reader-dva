import storage from './storage';


export default {
  get() {
    return storage.get('sessionToken');
  },
  set(sessionToken) {
    return storage.set('sessionToken', sessionToken);
  },
  remove() {
    return storage.remove('sessionToken');
  },
};
