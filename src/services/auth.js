import accessToken from '../utils/accessToken';

export default {
  async getAccessToken() {
    return accessToken.get();
  },
  async setAccessToken(token) {
    return accessToken.set(token);
  },
  async removeAccessToken() {
    return accessToken.remove();
  },

};
