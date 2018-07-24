import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Button, Card, Avatar } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
// import userServices from '../../services/user';
import styles from './index.module.less';


class Watching extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //   list: undefined,
    // };
    // this.load = this.load.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  async subscribe(e, record) {
    if (record.loading) {
      return;
    }
    await this.props.dispatch({ type: 'watching/subscribe', payload: { owner: record.owner, repo: record.repo } });
  }
  async unsubscribe(e, record) {
    if (record.loading) {
      return;
    }
    const result = await this.props.dispatch({ type: 'app/unsubscribe', payload: { owner: record.owner, repo: record.name } });
    this.update(record, { loading: false, watch: !result });
  }
  render() {
    // const columns = this.getColumns();
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
              columns={[{
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
                dataIndex: 'repo',
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
              }]}
              dataSource={this.props.list}
              loading={this.props.loading}
              pagination={false}
              rowKey={record => `${record.owner}/${record.repo}`}
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
  // repos: state.app.repos,
  list: state.watching.list,
  loading: state.watching.loading,
}))(Watching);
