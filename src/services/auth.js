import sessionToken from '../utils/sessionToken';

export default {
  async getSessionToken() {
    const token = sessionToken.get();
    if (token) {
      return token;
    } else {
      return null;
    }
  },
  async setSessionToken(token) {
    return sessionToken.set(token);
  },
  async removeSessionToken() {
    return sessionToken.remove();
  },
};
