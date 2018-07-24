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
  }
  async showIssueDetail(e, item) {
    await this.setState({ selected: undefined });
    console.log(item);
    await this.setState({ selected: item });
  }
  async hideIssueDetail() {
    await this.setState({ selected: undefined });
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
            {(!item.favorite) && <Icon onClick={e => this.toggleFavorite(e, item)} type="heart-o" />}
            {item.favorite && <Icon onClick={e => this.toggleFavorite(e, item)} type="heart" />}
            <a href={`https://github.com/${item.owner}/${item.repo}/issues/${item.number}`} target="_blink">
              <Icon type="export" />
            </a>
          </div>
        </List.Item>}
      />
      {this.state.selected && <Issue
        info={this.state.selected}
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
