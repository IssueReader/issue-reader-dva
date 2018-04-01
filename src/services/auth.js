import { getSessionToken, setSessionToken, removeSessionToken } from '../utils/auth';

export default {
  async getSessionToken() {
    try {
      debugger;
      const token = await getSessionToken();
      return token;
    } catch (err) {
      return null;
    }
  },
  async setSessionToken(token) {
    return setSessionToken(token);
  },
  async removeSessionToken() {
    return removeSessionToken();
  },
};
