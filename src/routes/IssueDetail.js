import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar } from 'antd';
import Marked from '../components/Marked';

import styles from './IssueDetail.module.less';

class IssueDetail extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const { issue } = this.props;
    return (
      <div className={styles.issue}>
        <div className={styles.context}>
          <h1 className={styles.title}>
            <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${issue.owner}/${issue.repo}/issues/${issue.number}`}>
              {issue.title}
            </a>
          </h1>
          <p className={styles.owner}>
            <span className={styles.user}>
              <Avatar size="small" src={issue.avatarUrl} />
              <span className={styles.name}>{issue.name}</span>
            </span>
            <span className={styles.time}>{moment(issue.createdAt).format('YYYY年M月D日')}</span>
          </p>
          <Marked context={issue.body} />
        </div>
      </div>
    );
  }
}

IssueDetail.propTypes = {
  issue: PropTypes.object,
};

export default IssueDetail;
