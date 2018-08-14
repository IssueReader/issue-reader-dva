import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, List, Avatar } from 'antd';
import Issue from './Issue';
import styles from './index.module.less';


class Issues extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
    };
    // this.toggleFavorite = this.toggleFavorite.bind(this);
    // this.keepUnread = this.keepUnread.bind(this);
  }
  async showIssueDetail(e, item) {
    await this.setState({ selected: undefined });
    console.log(item);
    await this.setState({ selected: item });
    // if (!item.read) {
    //   this.props.updateIssue({ owner: item.owner, repo: item.repo, number: item.number, read: true });
    // }
  }
  async hideIssueDetail() {
    await this.setState({ selected: undefined });
  }
  // toggleFavorite(e, item) {
  //   this.props.updateIssue({ owner: item.owner, repo: item.repo, number: item.number, favorite: !item.favorite });
  // }
  // markAsRead(item) {
  //   this.props.updateIssue({ owner: item.owner, repo: item.repo, number: item.number, read: true });
  // }
  // keepUnread(item) {
  //   this.props.updateIssue({ owner: item.owner, repo: item.repo, number: item.number, read: false });
  // }
  updateIssue(item, info) {
    this.props.updateIssue({ owner: item.owner, repo: item.repo, number: item.number, ...info });
    const selected = this.state.selected;
    if (selected &&
      item.owner === selected.owner &&
      item.repo === selected.repo &&
      item.number === selected.number) {
      this.setState({ selected: { ...selected, ...info } });
    }
  }
  render() {
    return (<React.Fragment>
      <List
        size="large"
        rowKey={record => `${record.owner}/${record.repo}/${record.number}`}
        loading={this.props.loading}
        className={styles.list}
        dataSource={this.props.list}
        pagination={false}
        renderItem={item => <List.Item onClick={e => this.showIssueDetail(e, item)}>
          <Avatar size="small" src={item.user.avatarUrl} />
          <div className={styles.user}>{item.user.name}</div>
          <div className={item.read ? styles.title : styles.unreadTitle}>
            <a onClick={e => e.preventDefault()} href={`https://github.com/${item.owner}/${item.repo}/issues/${item.number}`}>{item.title}</a>
          </div>
          <div className={styles.time}>{moment(item.createdAt).format('YYYY年M月D日')}</div>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            {(!item.favorite) && <Icon title="收藏" onClick={() => this.updateIssue(item, { favorite: true })} type="heart-o" />}
            {item.favorite && <Icon title="取消收藏" onClick={() => this.updateIssue(item, { favorite: false })} type="heart" />}
            <a href={`https://github.com/${item.owner}/${item.repo}/issues/${item.number}`} target="_blink">
              <Icon type="export" />
            </a>
          </div>
        </List.Item>}
      />
      {this.state.selected && <Issue
        info={this.state.selected}
        updateIssue={(item, info) => this.updateIssue(item, info)}
        onCancle={() => this.hideIssueDetail()}
      />}
    </React.Fragment>);
  }
}

Issues.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
};

export default Issues;
