import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { Modal, Avatar, Divider, Icon, Alert } from 'antd';
import moment from 'moment';
import Marked from '../../Marked';
import Loading from '../../Loading';
import localForageService from '../../../services/localForage';
import styles from './index.module.less';


class Issue extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: true,
      detail: undefined,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true, detail: undefined });
    const { data } = await localForageService.getIssueInfo(this.props.info);
    if (true !== this.state.loading) {
      return;
    }
    this.setState({ loading: false, detail: data || null });
    if (data && !this.props.info.read) {
      this.props.updateIssue(this.props.info, { read: true });
    }
  }
  componentWillUnmount() {
    this.setState({ loading: false, detail: false });
  }
  onCancel() {
    if (this.state.loading) {
      return;
    }
    this.setState({ visible: false });
    this.props.onCancle();
  }
  render() {
    const { info } = this.props;
    return (<Modal
      className={styles.modal}
      // style={{ top: 0, right: 0, height: '100%', paddingBottom: 0 }}
      width="80%"
      // title={<a onClick={e => e.preventDefault()} href={`https://github.com/${info.owner}/${info.repo}/issues/${info.number}`}>{info.title}</a>}
      title={<span className={styles.modalTitle}>{info.title}</span>}
      visible={this.state.visible}
      onCancel={() => this.onCancel()}
      footer={null}
      destroyOnClose
      maskClosable
    >
      <div className={styles.body}>
        <h1 className={styles.title}>{info.title}</h1>
        <div className={styles.info}>
          <a href={`https://github.com/${info.owner}/${info.repo}/issues/${info.number}`} target="_blank">查看原文</a>
          <Divider type="vertical" />
          <Avatar className={styles.avatarUrl} size="small" src={info.user.avatarUrl} />
          <span className={styles.userName}>&nbsp;&nbsp;{info.user.name}</span>
          <Divider type="vertical" />
          {moment(info.createdAt).format('YYYY年M月D日')}
          <Divider type="vertical" />
          {(!info.favorite) && <span onClick={() => this.props.updateIssue(this.props.info, { favorite: true })}>
            <Icon type="heart-o" />
            <span className={styles.favoriteText}>&nbsp;&nbsp;收藏</span>
          </span>}
          {info.favorite && <span onClick={() => this.props.updateIssue(this.props.info, { favorite: false })}>
            <Icon type="heart" />
            <span className={styles.favoriteText}>&nbsp;&nbsp;取消收藏</span>
          </span>}
          <Divider type="vertical" />
          <span className={styles.keepUnread} onClick={() => this.props.updateIssue(this.props.info, { read: false })}>保持未读</span>
        </div>
        {undefined === this.state.detail && <Loading />}
        {null === this.state.detail && <Alert
          message="加载失败"
          description="获取文章详细信息失败，请检查网络"
          type="error"
          showIcon
        />}
        {this.state.detail && <Marked context={this.state.detail.body} />}
      </div>
    </Modal>);
  }
}

Issue.propTypes = {
  info: PropTypes.object,
};

export default Issue;
