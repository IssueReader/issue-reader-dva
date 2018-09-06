import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Input, notification, Avatar, List } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
import styles from './index.module.less';

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
  push({ owner, repo }) {
    this.props.dispatch(routerRedux.push({
      pathname: `/discovery/${owner}/${repo}`,
    }));
  }
  render() {
    const list = [
      { owner: 'lifesinger', repo: 'blog', name: 'lifesinger', avatarUrl: 'https://avatars2.githubusercontent.com/u/97227' },
      { owner: 'xufei', repo: 'blog', name: 'xufei', avatarUrl: 'https://avatars2.githubusercontent.com/u/2725159' },
      { owner: 'sorrycc', repo: 'blog', name: 'chencheng (云谦)', avatarUrl: 'https://avatars1.githubusercontent.com/u/35128' },
      { owner: 'fouber', repo: 'blog', name: '张云龙', avatarUrl: 'https://avatars1.githubusercontent.com/u/536297' },
      { owner: 'youngwind', repo: 'blog', name: '梁少峰', avatarUrl: 'https://avatars0.githubusercontent.com/u/8401872' },
      { owner: 'mqyqingfeng', repo: 'Blog', name: '冴羽', avatarUrl: 'https://avatars1.githubusercontent.com/u/11458263' },
      { owner: 'dwqs', repo: 'blog', name: 'Pomy', avatarUrl: 'https://avatars3.githubusercontent.com/u/7871813' },
      { owner: 'jawil', repo: 'blog', name: '微醺岁月', avatarUrl: 'https://avatars0.githubusercontent.com/u/16515708' },
      { owner: 'camsong', repo: 'blog', name: 'Cam Song', avatarUrl: 'https://avatars1.githubusercontent.com/u/948896' },
      { owner: 'wengjq', repo: 'Blog', name: 'wengjq', avatarUrl: 'https://avatars3.githubusercontent.com/u/17982300' },
      { owner: 'Colafornia', repo: 'little-robot', name: 'Colafornia', avatarUrl: 'https://avatars3.githubusercontent.com/u/13252625' },
      { owner: 'riskers', repo: 'blog', name: '一波不是一波', avatarUrl: 'https://avatars1.githubusercontent.com/u/5653652' },
    ];
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
          {/* <Card bordered={false}>
            后续加入优质博客推荐功能，暂不支持
          </Card> */}
          <List
            grid={{ gutter: 16, xxl: 6, xl: 4, sm: 3 }}
            dataSource={list}
            renderItem={it => (
              <List.Item>
                <Card className={styles.pointer} title={`${it.owner}/${it.repo}`} onClick={() => this.push(it)}>
                  <Avatar size="small" shape="square" src={it.avatarUrl} />
                  &nbsp;{it.name}
                </Card>
              </List.Item>
            )}
          />
          {/* <Row gutter={16}>
            {list.map(it => <Col xxl={4} xl={6} lg={4}>
              <Card bordered={false}>
                <div>
                  <Avatar size="small" shape="square" src={it.avatarUrl} />
                  &nbsp;{it.owner}/{it.repo}
                </div>
                <div>{it.name}</div>
              </Card>
            </Col>)}
          </Row> */}
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
