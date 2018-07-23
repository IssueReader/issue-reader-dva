// import gql from 'graphql-tag';
import getClient from './apolloClient';

const query = async (schema) => {
  const client = await getClient();
  if (!client) {
    return { errMsg: { message: 'get graphql client failed!' } };
  }
  try {
    const resp = await client.query({ query: schema });
    return { data: resp.data };
  } catch (errMsg) {
    return { errMsg };
  }
};

export default {
  query,
};
