import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Switch, Redirect, routerRedux, Link } from 'dva/router';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
// import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import getAppRoutes from '../common/router';
// import All from './All';
// import Discovery from './Discovery';
// import RepoInfo from './RepoInfo';
// import Repo from './Repo';
// import Favorites from './Favorites';
// import Profile from './Profile';
// import Watching from './Watching';
// import Search from './Search';
import styles from './BasicLayout.module.less';

const { Header, Content, Sider } = Layout;
const SiderMenu = ({ pathname, repos, onClick }) => {
  if (pathname.match(/^\/user\/.*/)) {
    const selectedKeys = [pathname];
    return (
      <Menu defaultSelectedKeys={['/user/profile']} selectedKeys={selectedKeys} mode="inline" onClick={onClick}>
        <Menu.Item key="/user/profile">
          <Icon type="user" />
          <span>&nbsp;个人中心</span>
        </Menu.Item>
        <Menu.Item key="/user/watching">
          <Icon type="github" />
          <span>&nbsp;关注</span>
        </Menu.Item>
      </Menu>
    );
  } else if (!pathname.match(/^\/search(\/.*)?/)) {
    const selectedKeys = [];
    if (pathname.match(/^\/repos\/.*/)) {
      selectedKeys.push('/repos', pathname);
    } else if (pathname.match(/^\/discovery\/.*/)) {
      selectedKeys.push('/discovery');
    } else {
      selectedKeys.push(pathname);
    }
    // const selectedKeys = pathname.match(/^\/repos\/.*/) ? ['repos', pathname] : [pathname];
    return (
      <Menu
        defaultSelectedKeys={['/all']}
        // defaultOpenKeys={['/repos']}
        selectedKeys={selectedKeys}
        mode="inline"
        onClick={onClick}
      >
        <Menu.Item key="/all">所有</Menu.Item>
        <Menu.SubMenu key="/repos" title="我的订阅" className={styles.subMenu}>
          {repos &&
            repos.map(
              it =>
                it && (
                  <Menu.Item key={`/repos/${it.owner}/${it.repo}`}>
                    {it.user && <Avatar size="small" shape="square" src={it.user.avatarUrl} />}
                    &nbsp;
                    {it.owner}/{it.repo}
                  </Menu.Item>
                ),
            )}
          {(!repos || 0 === repos.length) && (
            <Menu.Item key="no-data" disabled>
              没有订阅
            </Menu.Item>
          )}
        </Menu.SubMenu>
        <Menu.Item key="/favorites">我的收藏</Menu.Item>
        <Menu.Item key="/discovery">发现</Menu.Item>
      </Menu>
    );
  } else {
    const selectedKeys = [pathname];
    return (
      <Menu
        defaultSelectedKeys={['/search']}
        mode="inline"
        selectedKeys={selectedKeys}
        // theme="dark"
        onClick={onClick}
      >
        <Menu.Item key="/search">搜索结果</Menu.Item>
      </Menu>
    );
  }
};

class BasicLayout extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.handleClick = this.handleClick.bind(this);
  // }
  onUserMenuClick = ({ key }) => {
    if ('logout' === key) {
      this.props.dispatch({ type: 'app/logout' });
    } else {
      this.props.dispatch(routerRedux.push(key));
    }
  };

  onSiderMenuClick = ({ key }) => {
    this.props.dispatch(routerRedux.push(key));
  };

  render() {
    const { app, location, userInfo, repos } = this.props;

    // const link = getDefaultLink(repos);

    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <a
            className={styles.logo}
            href="https://github.com/IssueReader/IssueReader.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt="IssueReader" src="/logo128x128.png" />
          </a>
          <div className={styles.navBar}>
            <Link to="/all">
              <Icon type="home" />
              &nbsp;&nbsp;首页
            </Link>
          </div>
          <div className={styles.navExtra}>
            {/* <div className={styles.navItem}>
              <HeaderSearch
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />
            </div> */}
            {/* <div className={styles.navItem}>
              <Icon type="check-square-o" />
              <span>&nbsp;Mark All as Read</span>
            </div> */}
            <div className={styles.navItem} onClick={() => this.props.dispatch(routerRedux.push('/discovery'))}>
              <Icon type="plus" />
              <span>&nbsp;添加</span>
            </div>
            <a
              className={styles.navItem}
              href="https://github.com/IssueReader/IssueReader.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon type="github" />
              <span>&nbsp;Star on Github</span>
            </a>
            <Dropdown
              overlay={
                <Menu onClick={this.onUserMenuClick}>
                  <Menu.Item key="/user/profile">
                    <Icon type="user" />
                    <span>&nbsp;个人中心</span>
                  </Menu.Item>
                  <Menu.Item key="/user/watching">
                    <Icon type="github" />
                    <span>&nbsp;关注</span>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="logout">
                    <Icon type="logout" />
                    <span>&nbsp;注销</span>
                  </Menu.Item>
                </Menu>
              }
            >
              <div className={styles.navItem}>
                <Avatar size="small" src={userInfo.avatarUrl} />
                <span className={styles.username}>
                  &nbsp;
                  {userInfo.name}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Layout>
            <Sider className={styles.sider} width="240">
              <SiderMenu pathname={location.pathname} repos={repos} onClick={this.onSiderMenuClick} />
              <div className={styles.placehoder} />
            </Sider>
            <Layout className={styles.siderRight}>
              <Content style={{ overflow: 'initial' }}>
                <Switch>
                  {getAppRoutes(app)}
                  <Redirect push from="*" to="/all" />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

BasicLayout.propTypes = {
  repos: PropTypes.array,
  // issues: PropTypes.array,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  userInfo: state.app.userInfo,
  repos: state.app.repos,
}))(BasicLayout);
