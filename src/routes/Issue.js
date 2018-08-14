import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Avatar, Icon } from 'antd';
import IssueDetail from './IssueDetail';

import styles from './Issue.module.less';


const jump = (e, issue) => {
  e.preventDefault();
  window.open(`https://github.com/${issue.owner}/${issue.repo}/issues/${issue.number}`);
};
class Issue extends React.PureComponent {
  toggleFavorite(e, issue) {
    e.preventDefault();
    this.props.toggleFavorite(issue);
  }
  render() {
    // eslint-disable-next-line
    const {
      issue,
      opened,
      toggle,
    } = this.props;
    return (
      <List.Item className={opened ? styles.openedIssue : styles.issue}>
        <Avatar size="small" src={issue.avatarUrl} />
        <div onClick={() => toggle(issue)} className={styles.user}>{issue.name}</div>
        <div onClick={() => toggle(issue)} className={issue.read ? styles.title : styles.unreadTitle}>{issue.title}</div>
        <div onClick={() => toggle(issue)} className={styles.time}>{moment(issue.createdAt).format('YYYY年M月D日')}</div>
        <div className={styles.actions}>
          {(!issue.favorite) && <Icon onClick={e => this.toggleFavorite(e, issue)} type="heart-o" />}
          {issue.favorite && <Icon onClick={e => this.toggleFavorite(e, issue)} type="heart" />}
          <Icon type="export" onClick={e => jump(e, issue)} />
        </div>
        {opened && <IssueDetail issue={issue} />}
      </List.Item>
    );
  }
}

Issue.propTypes = {
  issue: PropTypes.object,
  opened: PropTypes.bool,
  toggle: PropTypes.func,
  toggleFavorite: PropTypes.func,
};

export default Issue;
