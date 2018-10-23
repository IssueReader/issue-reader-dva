import localForage from 'localforage';
import github from '../utils/github';

const clearDB = async () => {
  await localForage.setItem('repos', []);
  await localForage.setItem('issues', []);
  await localForage.setItem('favorites', []);
  await localForage.setItem('read', []);
  await localForage.setItem('utime', 0);
};

const getItem = async (key, defaultValue = []) => {
  try {
    const list = await localForage.getItem(key);
    return list || defaultValue;
  } catch (errMsg) {
    return defaultValue;
  }
};
const setItem = async (key, value) => {
  try {
    await localForage.setItem(key, value);
  } catch (errMsg) {}
  return value;
};

const updateRepoInfo = async repoInfo => {
  const repos = await getItem('repos');
  const index = repos.findIndex(it => it.owner === repoInfo.owner && it.repo === repoInfo.repo);
  if (-1 === index) {
    repos.push(repoInfo);
  } else {
    repos[index] = { ...repos[index], ...repoInfo };
  }
  await setItem('repos', repos);
};
const updateIssueList = async list => {
  const issues = await getItem('issues');
  list.map(issue => {
    const index = issues.findIndex(
      it => it.owner === issue.owner && it.repo === issue.repo && it.number === issue.number,
    );
    if (-1 === index) {
      issues.push(issue);
    } else {
      issues[index] = { ...issues[index], ...issue };
    }
    return issue;
  });
  issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  await setItem('issues', issues);
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
  async getUpdateTime() {
    try {
      const utime = await localForage.getItem('utime');
      return utime;
    } catch (errMsg) {
      return 0;
    }
  },
  async setUpdateTime() {
    try {
      const utime = new Date().getTime();
      await localForage.setItem('utime', utime);
      return utime;
    } catch (errMsg) {
      return 0;
    }
  },
  async getRepos() {
    return getItem('repos');
  },
  async syncRepoInfo(repo) {
    if (!repo.owner || !repo.repo) {
      return { data: repo };
    }
    const info = await github.getRepoInfo(repo);
    if (info.errMsg) {
      return info;
    }
    const { list, ...repoInfo } = info.data;
    await updateRepoInfo(repoInfo);
    await updateIssueList(list);
    return repoInfo;
  },
  async addRepo({ owner, repo }) {
    const info = await github.getRepoInfo({ owner, repo });
    if (info.errMsg) {
      return info;
    }
    const { list, ...repoInfo } = info.data;
    await updateRepoInfo(repoInfo);
    await updateIssueList(list);
    return info;
  },
  async delRepo({ owner, repo }) {
    const repos = await getItem('repos');
    const index = repos.findIndex(it => it.owner === owner && it.repo === repo);
    if (-1 !== index) {
      repos.splice(index, 1);
      await setItem('repos', repos);
    }
    const issues = await getItem('issues');
    const list = issues.filter(it => it.owner !== owner || it.repo !== repo || !it.favorite);
    if (list.length < issues.length) {
      await setItem('issues', list);
    }
    return { owner, repo };
  },
  async updateRepo(repoInfo) {
    await updateRepoInfo(repoInfo);
    return repoInfo;
  },
  async getIssues(start = 0, limit = 100) {
    const issues = await getItem('issues');
    const total = issues.length;
    const list = issues.slice(start, Math.min(start + limit, total));
    return { data: { list, total, start } };
  },
  async getRepoInfo({ owner, repo }) {
    // const [repos, issues] =  await Promise.all(getItem('repos'), getItem('issues'));
    const repos = await getItem('repos');
    const respInfo = repos.find(it => owner === it.owner && repo === it.repo);
    if (!respInfo) {
      return { errMsg: { response: { status: '404', message: 'resp not found' } } };
    }
    const issues = await getItem('issues');
    const list = issues.filter(it => owner === it.owner && repo === it.repo);
    return { data: { ...respInfo, list } };
  },
  async getIssueInfo(data) {
    return github.getIssueInfo(data);
  },
  async updateIssue(info) {
    const issues = await getItem('issues');
    const index = issues.findIndex(it => it.owner === info.owner && it.repo === info.repo && it.number === info.number);
    if (-1 !== index) {
      issues[index] = { ...issues[index], ...info };
      await setItem('issues', issues);
    }
  },
  async getFavoriteIssues(start = 0, limit = 100) {
    const issues = await getItem('issues');
    const favoriteIssues = issues.filter(it => it && it.favorite);
    const total = favoriteIssues.length;
    const list = favoriteIssues.slice(start, Math.min(start + limit, total));
    return { data: { list, total, start } };
  },
};
