import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Button, Card, Avatar } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import userServices from '../../services/user';
import styles from './index.module.less';


class Watching extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: undefined,
    };
    this.load = this.load.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  componentDidMount() {
    this.load();
  }
  getColumns() {
    return [{
      title: '博主',
      key: 'owner',
      render: (text, record) => (
        <span>
          <Avatar src={record.avatarUrl} />
          &nbsp;&nbsp;{record.owner}
        </span>
      ),
    }, {
      title: 'Github 仓库',
      dataIndex: 'name',
      key: 'repo',
    }, {
      title: '文章数',
      dataIndex: 'issueCount',
      key: 'issueCount',
    }, {
      title: 'star 人数',
      dataIndex: 'starCount',
      key: 'starCount',
    }, {
      title: '订阅人数',
      dataIndex: 'watchCount',
      key: 'watchCount',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        record.watch ?
          <Button loading={record.loading} onClick={e => this.unsubscribe(e, record)}>退订</Button> :
          <Button type="primary" loading={record.loading} onClick={e => this.subscribe(e, record)}>订阅</Button>
      ),
    }];
  }
  async load() {
    this.setState({ list: undefined });
    const { data } = await userServices.getWatching();
    debugger;
    if (!data) {
      return this.setState({ list: null });
    }
    return this.setState({
      list: data.list.map((it) => {
        const index = this.props.repos.findIndex((item) => {
          return it.name === item.repo && it.owner === item.owner;
        });
        return { ...it, watch: -1 !== index };
      }),
    });
  }
  async subscribe(e, record) {
    if (record.loading) {
      return;
    }
    this.update(record, { loading: true });
    const result = await this.props.dispatch({ type: 'app/subscribe', payload: { owner: record.owner, repo: record.name } });
    this.update(record, { loading: false, watch: result });
  }
  async unsubscribe(e, record) {
    if (record.loading) {
      return;
    }
    const result = await this.props.dispatch({ type: 'app/unsubscribe', payload: { owner: record.owner, repo: record.name } });
    this.update(record, { loading: false, watch: !result });
  }
  update(record, info) {
    const list = this.state.list.map((it) => {
      if (it.owner === record.owner && it.name === record.name) {
        return { ...it, ...info };
      } else {
        return { ...it };
      }
    });
    this.setState({ list });
  }
  render() {
    const columns = this.getColumns();
    return (
      <React.Fragment>
        <PageHeader
          title="我的 Github 关注列表"
          action={<Button type="primary" onClick={this.load}>刷新</Button>}
          breadcrumbList={[{ title: null }]}
        />
        <div className={styles.container}>
          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={this.state.list}
              loading={undefined === this.state.list}
              pagination={false}
              rowKey={record => `${record.owner}/${record.name}`}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

Watching.propTypes = {
  // repos: PropTypes.array,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  repos: state.app.repos,
}))(Watching);
