// import storage from '../utils/storage';
import resource from '../utils/resource';
// import { request } from '../utils/request';

const user = () => {
  return resource('/user/:type/:owner/:repo/issues/:number');
};


export default {
  async loginByCode({ code }) {
    return user().post({}, { code });
  },
  async loginByToken({ token }) {
    return user().post({}, { token });
  },
  async getRepos() {
    return user().get({ type: 'repos' });
  },
  async getFavorites() {
    return user().get({ type: 'favorites' });
  },
};
