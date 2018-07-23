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
  } catch (errMsg) {

  }
  return value;
};


const updateRepoInfo = async (repoInfo) => {
  const repos = await getItem('repos');
  const index = repos.findIndex(it => it.owner === repoInfo.owner && it.repo === repoInfo.repo);
  if (-1 === index) {
    repos.push(repoInfo);
  } else {
    repos[index] = repoInfo;
  }
  await setItem('repos', repos);
};
const updateIssueList = async (list) => {
  const issues = await getItem('issues');
  list.map((issue) => {
    const index = issues.findIndex(it => it.owner === issue.owner && it.repo === issue.repo && it.number === issue.number);
    if (-1 === index) {
      issues.push(issue);
    } else {
      issues[index] = { ...issues[index], ...issue };
    }
    return issue;
  });
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
    debugger;
    const info = await github.getRepoInfo({ owner, repo });
    if (info.errMsg) {
      return info;
    }
    debugger;
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
    const list = issues.filter(it => (it.owner !== owner || it.repo !== repo));
    if (list.length < issues.length) {
      await setItem('issues', list);
    }
    return { owner, repo };
  },
};
