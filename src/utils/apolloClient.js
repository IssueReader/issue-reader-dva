import ApolloClient from 'apollo-boost';

import accessToken from './accessToken';

const getApolloClient = async () => {
  const token = await accessToken.get();
  if (!token) {
    return null;
  }
  return new ApolloClient({
    uri: 'https://api.github.com/graphql',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `${token.token_type} ${token.access_token}`,
    },
    // onError: ({ graphQLErrors, response }) => {
    //   debugger;
    //   return response;
    // }
  });
};

export default getApolloClient;
