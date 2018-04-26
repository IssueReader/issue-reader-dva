import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'dva';
// import moment from 'moment';
import { Card, Button } from 'antd';
// import PageHeader from 'ant-design-pro/lib/PageHeader';
// import { MarkdownPreview } from 'react-marked-markdown';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import Loading from '../Loading';
// import Issue from '../Issue';

import styles from './Login.less';

const jump2authorize = () => {
  window.location.replace('https://github.com/login/oauth/authorize?client_id=e3fcd5f1d9cfd0d5aaaa&redirect_uri=https%3A%2F%2Fissuereaderapi.leanapp.cn&scope=repo&state=github');
};

class Login extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   opened: undefined,
  //   // };
  //   this.login = this.login.bind(this);
  //   // this.toggleFavorite = this.toggleFavorite.bind(this);
  // }
  render() {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <img className={styles.logo} src="./logo128x128.png" alt="Github Iussue Blog Reader" />
          <div className={styles.title}>Iussue Reader</div>
          <div className={styles.subtitle}>Github Iussue Blog Reader</div>
          <Button className={styles.block} onClick={jump2authorize} type="primary" icon="github" size="large">Github 登录</Button>
        </Card>
      </div>
    );
  }
}

// Login.propTypes = {
//   issues: PropTypes.array,
//   dispatch: PropTypes.func,
// };

export default Login;
