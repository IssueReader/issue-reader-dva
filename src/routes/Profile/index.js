import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Button, Card, Avatar, Modal, Divider, Icon, Checkbox, notification } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
import localForageService from '../../services/localForage';
import styles from './index.module.less';


class Profile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
      loading: false,
    };
  }
  showModal(item) {
    if (this.state.selected || this.state.loading) {
      return;
    }
    this.setState({ selected: { ...item } });
  }
  hideModal() {
    if (this.state.loading) {
      return;
    }
    this.setState({ selected: undefined });
  }
  async updateRepo() {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    await localForageService.updateRepo({
      owner: this.state.selected.owner,
      repo: this.state.selected.repo,
      team: this.state.selected.team,
      filterAuthor: this.state.selected.filterAuthor,
    });
    this.props.dispatch({ type: 'app/updateRepos' });
    await localForageService.syncRepoInfo(this.state.selected);
    notification.success({ message: '保存成功', description: '' });
    this.setState({ selected: undefined, loading: false });
  }
  render() {
    return (<React.Fragment>
      <PageHeader
        logo={this.props.userInfo && <img alt="" src={this.props.userInfo.avatarUrl} />}
        title={this.props.userInfo.name}
        content={this.props.userInfo && <div>
          <div>{this.props.userInfo.login}</div>
          <div>{this.props.userInfo.bio}</div>
        </div>}
        action={<Button type="primary" onClick={() => Modal.alert({ message: '暂不支持同步配置文件功能' })}>同步</Button>}
        breadcrumbList={[{ title: null }]}
      />
      <PageBody>
        <Card bordered={false}>
          <Table
            columns={[{
              title: '博主',
              key: 'owner',
              render: (text, item) => (
                <span>
                  <Avatar src={item.user && item.user.avatarUrl} />
                  &nbsp;&nbsp;{item.owner}
                  {item.user && item.user.name && <span>（{item.user.name}）</span>}
                </span>
              ),
            }, {
              title: 'Github 仓库',
              dataIndex: 'repo',
              key: 'repo',
            }, {
              title: '文章数',
              dataIndex: 'totalCount',
              key: 'totalCount',
            }, {
              title: '团队博客',
              dataIndex: 'team',
              key: 'team',
              render: (value) => (value ? <span className={styles.highlight}>是</span> : <span className={styles.muted}>否</span>),
            }, {
              title: '过滤作者',
              dataIndex: 'filterAuthor',
              key: 'filterAuthor',
              render: (value) => (false === value ? <span className={styles.highlight}>否</span> : <span className={styles.muted}>是</span>),
            }, {
              title: '操作',
              key: 'action',
              render: (text, item) => (<React.Fragment>
                <Icon type="setting" onClick={() => this.showModal(item)} />
                <Divider type="vertical" />
                <a href={`https://github.com/${item.owner}/${item.repo}/issues`} target="_blink">
                  <Icon type="export" />
                </a>
              </React.Fragment>),
            }]}
            dataSource={this.props.repos}
            pagination={false}
            rowKey={record => `${record.owner}/${record.repo}`}
          />
        </Card>
      </PageBody>
      {this.state.selected && <Modal
        title={`${this.state.selected.owner}/${this.state.selected.repo}`}
        visible
        maskClosable={false}
        confirmLoading={this.state.loading}
        onOk={() => this.updateRepo()}
        onCancel={() => this.hideModal()}
      >
        <p>
          <Checkbox
            onChange={(e) => this.setState({ selected: { ...this.state.selected, team: e.target.checked } })}
            checked={true === this.state.selected.team}
          >团队博客</Checkbox>
        </p>
        <p>
          <Checkbox
            onChange={(e) => this.setState({ selected: { ...this.state.selected, filterAuthor: e.target.checked } })}
            checked={false !== this.state.selected.filterAuthor}
          >过滤作者</Checkbox>
        </p>
      </Modal>}
    </React.Fragment>);
  }
}


Profile.propTypes = {
  userInfo: PropTypes.object,
  repos: PropTypes.array,
};

export default connect(state => ({
  userInfo: state.app.userInfo,
  repos: state.app.repos,
}))(Profile);
