import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Input, notification } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
// import styles from './index.module.less';

class Discovery extends React.PureComponent {
  onSearch(value) {
    if (!value) {
      notification.error({ message: '请输入想订阅的仓库地址' });
      return;
    }
    const match = value.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
    if (!match || 3 !== match.length) {
      notification.error({ message: '仓库地址不合法，请检查' });
      return;
    }
    this.props.dispatch(routerRedux.push({
      pathname: `/discovery/${match[1]}/${match[2]}`,
    }));
  }
  render() {
    return (
      <React.Fragment>
        <PageHeader
          title={<Input.Search
            placeholder="输入想订阅的仓库地址，如 https://github.com/lifesinger/blog"
            onSearch={value => this.onSearch(value)}
            enterButton
          />}
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            后续加入优质博客推荐功能，暂不支持
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}

Discovery.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(Discovery);
