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

class Login extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     opened: undefined,
  //   };
  //   this.toggle = this.toggle.bind(this);
  //   this.toggleFavorite = this.toggleFavorite.bind(this);
  // }
  render() {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <img className={styles.logo} src="./logo128x128.png" alt="Github Iussue Blog Reader" />
          <div className={styles.title}>Github Iussue Blog Reader</div>
          <Button className={styles.block} type="primary" icon="github" size="large">Github 登录</Button>
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
