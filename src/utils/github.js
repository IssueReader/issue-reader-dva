import gql from 'graphql-tag';
import graphql from './graphql';

const parseUserInfo = (info, owner) => {
  const userInfo = { avatarUrl: '', bio: '', name: owner };
  if (!info || !info.data) {
    return userInfo;
  }
  if (info.data.user) {
    return info.data.user;
  } else if (info.data.organization) {
    info.data.organization.bio = '';
    return info.data.organization;
  } else {
    return userInfo;
  }
};

export default {
  getUserInfo() {
    return graphql.query(gql`query {
      viewer {
        login
        avatarUrl
        name
        bio
      }
    }`);
  },
  async getRepoInfo({ owner, repo }) {
    const info = await graphql.query(gql`query {
      repository(owner: "${owner}", name: "${repo}") {
        issues(last : 100, states:OPEN, orderBy:{field:CREATED_AT, direction:DESC}){
          totalCount
          edges{
            node{
              title
              number
              createdAt
              updatedAt
              author{
                login
              }
            }
          }
        }
      }
      user(login: "${owner}"){
        avatarUrl
        bio
        name
      }
    }`);
    // debugger;
    if (info.errMsg) {
      return info;
    }
    const user = parseUserInfo(info, owner);
    const issues = info && info.data && info.data.repository && info.data.repository.issues;
    const totalCount = (issues && issues.totalCount) || 0;
    const edges = (issues && issues.edges) || [];
    // debugger;
    const data = {
      owner,
      repo,
      totalCount: totalCount,
      list: edges.filter(it => it.node.author && it.node.author.login === owner).map((it) => {
        return { owner, repo, ...it.node, user };
      }),
      user,
    };
    return { data };
  },
  async getWatching(cursor) {
    const info = await graphql.query(gql`query {
      viewer {
        watching (first: 100${cursor ? `, after: "${cursor}"` : ''}){
          totalCount
          edges{
            cursor
            node{
              owner {
                login
                avatarUrl
              }
              name
              issues (states:OPEN){
                totalCount
              }
              stargazers {
                totalCount
              }
              watchers{
                totalCount
              }
            }
          }
        }
      }
    }`);
    if (info.errMsg) {
      return info;
    }
    const { totalCount, edges } = info.data.viewer.watching;
    const data = {
      totalCount,
      list: edges.map((it) => {
        return {
          cursor: it.cursor,
          owner: it.node.owner.login,
          avatarUrl: it.node.owner.avatarUrl,
          repo: it.node.name,
          issueCount: it.node.issues.totalCount,
          starCount: it.node.stargazers.totalCount,
          watchCount: it.node.watchers.totalCount,
        };
      }),
    };
    return { data };
  },
  async getIssueInfo({ owner, repo, number }) {
    const info = await graphql.query(gql`query {
      repository(owner: "${owner}", name: "${repo}") {
        issue(number:${number}){
          body
        }
      }
    }`);
    if (info.errMsg) {
      return info;
    }
    const data = {
      owner,
      repo,
      number,
      body: info.data.repository.issue.body,
    };
    return { data };
  },
};
