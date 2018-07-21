// import storage from '../utils/storage';
import gql from 'graphql-tag';
import resource from '../utils/resource';
import request from '../utils/request';
import graphql from '../utils/graphql';
// import sessionToken from '../utils/sessionToken';

const user = () => {
  return resource('/user/:type/:owner/:repo/issues/:number');
};


export default {
  async getAccessTokenByCode(data) {
    return request('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // return user().post({}, { code, state });
  },
  async getUserInfo() {
    return graphql.query(gql`query {
      viewer {
        login
        avatarUrl
        name
        bio
      }
    }`);
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
  async getRepoInfo({ owner, repo }) {
    return user().get({ type: 'repos', owner, repo });
  },
  async addRepo({ owner, repo }) {
    return user().post({ type: 'repos' }, { owner, repo });
  },
  async delRepo({ owner, repo }) {
    return user().remove({ type: 'repos' }, { owner, repo });
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
  async getWatching() {
    return user().get({ type: 'watching' });
  },
};
