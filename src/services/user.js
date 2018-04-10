// import storage from '../utils/storage';
import resource from '../utils/resource';
// import { request } from '../utils/request';

const user = () => {
  return resource('/user/:type/:owner/:repo/issues/:number');
};


export default {
  async loginByCode(data) {
    return user().post({}, data);
  },
  async loginByToken(data) {
    return user().post({}, data);
  },
  async login(data) {
    return user().post({}, data);
  },
  async getRepos() {
    return user().get({ type: 'repos' });
  },
  async getIssues() {
    return user().get({ type: 'issues' });
  },
  async getFavorites() {
    return user().get({ type: 'favorites' });
  },
  async markAsRead({ owner, repo, number }) {
    return user().post({ type: 'repos', owner, repo, number });
  },
  async markAsFavorite({ owner, repo, number }) {
    return user().post({ type: 'favorites' }, { owner, repo, number });
  },
  async removeFavorite({ owner, repo, number }) {
    return user().remove({ type: 'favorites' }, { owner, repo, number });
  },
};
