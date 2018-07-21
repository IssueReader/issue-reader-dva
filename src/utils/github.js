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
  getRepoInfo({ owner, repo }) {
    return graphql.query(gql`query {
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
  },
  async getWatching(cursor) {
    return graphql.query(gql`query {
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
  },
};
