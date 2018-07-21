import localForage from 'localforage';
import github from '../utils/github';


const clearDB = async () => {
  await localForage.setItem('repos', []);
  await localForage.setItem('issues', []);
  await localForage.setItem('favorites', []);
  await localForage.setItem('read', []);
  await localForage.setItem('utime', 0);
};

const updateDB = async () => {
  const ltime = await localForage.getItem('ltime') || 0;
  const repos = await localForage.getItem('repos') || [];
  const current = new Date().getTime();
  if (60 * 60 * 1000 > current - ltime || 0 === repos.length) {
    return;
  }
  // TODO: 更新所有仓库 issue 列表
};

const getList = async (key) => {
  try {
    const repos = await localForage.getItem(key);
    return repos || [];
  } catch (errMsg) {
    return [];
  }
};

export default {
  async checkUser(userInfo) {
    try {
      const userId = await localForage.getItem('userId');
      if (userId !== userInfo.login) {
        await clearDB();
        await localForage.setItem('userId', userInfo.login);
      }
      return true;
    } catch (errMsg) {
      return false;
    }
  },
  async getRepos() {
    const repos = await getList('repos');
    return repos;
  },
  async syncRepoInfo(repo) {
    if (!repo.owner || !repo.repo) {
      return repo;
    }
    const { data } = await github.getRepoInfo(repo);
    if (!data) {
      return repo;
    }
    const repoInfo = { ...repo, user: data.user };
    const repos = await getList('repos');
    const index = repos.findIndex(it=> it.owner === repo.owner && it.repo === repo.repo);
    if (-1 === index) {
      repos.push(repoInfo);
    } else {
      repos[index] = repoInfo;
    }
    await localForage.setItem('repos', repos);
    return repoInfo;
  },
  async updateDB(userInfo) {
    // TODO: 检查缓存的 userInfo login 与 当期登录的是否一致，如果不一致，需要将
    try {
      const userId = await localForage.getItem('userId');
      if (userId !== userInfo.login) {
        await clearDB();
        await localForage.setItem('userId', userInfo.login);
      }
      updateDB();
      return true;
    } catch (errMsg) {
      debugger;
      return false;
    }
  },
};
