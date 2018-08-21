import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
import Issues from '../../components/Issues';
import localForageService from '../../services/localForage';


// import moment from 'moment';
// import { Button, Card, List } from 'antd';
// import PageHeader from 'ant-design-pro/lib/PageHeader';
// import { MarkdownPreview } from 'react-marked-markdown';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import Loading from '../Loading';
// import Issue from '../Issue';

import styles from './index.module.less';


class Repo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: undefined,
      list: undefined,
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.updateIssue = this.updateIssue.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  componentDidMount() {
    this.onRefresh();
  }
  componentWillUnmount() {
    this.setState({ loading: false });
  }
  async onRefresh() {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true, user: undefined, list: undefined });
    const { data } = await localForageService.getRepoInfo({
      owner: this.props.match.params.owner,
      repo: this.props.match.params.repo,
    });
    if (!this.state.loading) {
      return;
    }
    this.setState({ loading: false, list: data && data.list, user: data && data.user });
    // this.setState({ loading: false });
    // if (data) {
    //   const { list, ...info } = data;
    //   this.setState({ info, list });
    // } else {
    //   this.setState({ info: null, list: null });
    // }
  }
  async updateIssue(info) {
    // debugger;
    // this.props.dispatch({ type: 'all/updateIssue', payload: info });
    await localForageService.updateIssue(info);
    const list = this.state.list;
    const index = list.findIndex(it => it.owner === info.owner && it.repo === info.repo && it.number === info.number);
    if (-1 !== index) {
      const issues = [...list];
      issues[index] = { ...issues[index], ...info };
      this.setState({ list: issues });
    }
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
    this.props.dispatch(routerRedux.push({ pathname: '/all' }));
  }
  // isSubscribed() {
  //   if (!this.props.repos) {
  //     return false;
  //   }
  //   const params = this.props.match.params;
  //   const index = this.props.repos.findIndex(it => it.owner === params.owner && it.repo === params.repo);
  //   return (-1 !== index);
  // }
  render() {
    const { user, list } = this.state;
    // const subscribed = this.isSubscribed();
    return (
      <React.Fragment>
        <PageHeader
          logo={user && <img alt="" src={user.avatarUrl} />}
          title={`${this.props.match.params.owner}/${this.props.match.params.repo}`}
          content={user && <div>
            <div>{user.name}</div>
            <div>{user.bio}</div>
          </div>}
          action={<div className={styles.title}>
            {/* {(!subscribed) && <Button disabled={this.state.loading} type="primary" onClick={this.subscribe}>订阅</Button>} */}
            <Button disabled={this.state.loading} type="danger" onClick={this.unsubscribe}>退订</Button>
            <Button disabled={this.state.loading} onClick={this.onRefresh}>刷新</Button>
          </div>}
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            <Issues list={list} loading={this.state.loading} updateIssue={this.updateIssue} />
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}

Repo.propTypes = {
  issues: PropTypes.array,
  // dispatch: PropTypes.func,
};

export default connect(state => ({
  repos: state.app.repos,
  // issues: state.repo.issues,
}))(Repo);
