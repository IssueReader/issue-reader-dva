import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.module.less';

class All extends React.PureComponent {
  render() {
    return (
      <h1 style={{ textAlign: 'center', marginTop: '2em' }}>暂不支持，敬请期待...</h1>
    );
  }
}

All.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(All);
