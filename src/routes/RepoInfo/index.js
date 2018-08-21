import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
import Issues from '../../components/Issues';
import githubService from '../../services/github';
import styles from './index.module.less';

class RepoInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      list: [],
      user: undefined,
      // total: undefined,
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  componentDidMount() {
    this.onRefresh();
  }
  componentWillUnmount() {
    this.setState({ loading: false, list: [] });
  }
  async onRefresh() {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true, list: [] });
    const { data } = await githubService.getRepoInfo({
      owner: this.props.match.params.owner,
      repo: this.props.match.params.repo,
    });
    if (true !== this.state.loading) {
      return;
    }
    this.setState({ loading: false, list: data && data.list, user: data && data.user });
  }
  updateIssue(info) {
    // debugger;
    // this.props.dispatch({ type: 'all/updateIssue', payload: info });
  }
  async subscribe() {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    await this.props.dispatch({
      type: 'app/subscribe',
      payload: {
        owner: this.props.match.params.owner,
        repo: this.props.match.params.repo,
      },
    });
    if (true !== this.state.loading) {
      return;
    }
    this.setState({ loading: false });
  }
  async unsubscribe() {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    await this.props.dispatch({
      type: 'app/unsubscribe',
      payload: {
        owner: this.props.match.params.owner,
        repo: this.props.match.params.repo,
      },
    });
    if (true !== this.state.loading) {
      return;
    }
    this.setState({ loading: false });
  }
  isSubscribed() {
    if (!this.props.repos) {
      return false;
    }
    const params = this.props.match.params;
    const index = this.props.repos.findIndex(it => it.owner === params.owner && it.repo === params.repo);
    return (-1 !== index);
  }
  render() {
    const { user, list } = this.state;
    const subscribed = this.isSubscribed();
    return (
      <React.Fragment>
        <PageHeader
          logo={user && <img alt="" src={user.avatarUrl} />}
          title={<a href={`https://github.com/${this.props.match.params.owner}/${this.props.match.params.repo}`} target="_blank">
            {this.props.match.params.owner}/{this.props.match.params.repo}
          </a>}
          content={user && <div>
            <div>{user.name}</div>
            <div>{user.bio}</div>
          </div>}
          action={<div className={styles.title}>
            {(!subscribed) && <Button disabled={this.state.loading} type="primary" onClick={this.subscribe}>订阅</Button>}
            {subscribed && <Button disabled={this.state.loading} type="danger" onClick={this.unsubscribe}>退订</Button>}
            <Button disabled={this.state.loading} onClick={this.onRefresh}>刷新</Button>
          </div>}
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            <Issues list={list} loading={this.state.loading} updateIssue={this.updateIssue} />
            {/* <Pagination
              className={styles.pagination}
              current={this.props.page}
              showQuickJumper
              pageSize={this.props.pageSize}
              total={this.props.total}
              showTotal={t => `共 ${t} 项`}
              onChange={this.onPageChange}
            /> */}
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}

RepoInfo.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(RepoInfo);
