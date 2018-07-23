import gql from 'graphql-tag';
import graphql from './graphql';

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
        issues(first : 100, states:OPEN){
          totalCount
          edges{
            node{
              title
              number
              createdAt
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
    if (info.errMsg) {
      return info;
    }
    const data = {
      owner,
      repo,
      totalCount: info.data.repository.issues.totalCount,
      list: info.data.repository.issues.edges.map((it) => {
        return { owner, repo, ...it.node };
      }),
      user: info.data.user,
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
};
