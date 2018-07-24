import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import moment from 'moment';
import { Button, Card, List } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
// import { MarkdownPreview } from 'react-marked-markdown';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import Loading from '../Loading';
// import Issue from '../Issue';

import styles from './index.module.less';


class Repo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: undefined,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.isOpened = this.isOpened.bind(this);
  }
  toggle(item) {
    if (this.isOpened(item)) {
      this.setState({ opened: undefined });
    } else {
      if (!item.read) {
        this.props.dispatch({ type: 'issues/markAsRead', payload: item });
      }
      this.setState({ opened: { ...item } });
    }
  }
  toggleFavorite(item) {
    this.props.dispatch({ type: 'issues/toggleFavorite', payload: item });
  }
  isOpened(item) {
    const { opened } = this.state;
    return opened && item && opened.owner === item.owner && opened.repo === item.repo && opened.number === item.number;
  }
  render() {
    return (
      <h1 style={{ textAlign: 'center', marginTop: '2em' }}>暂不支持，敬请期待...</h1>
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
