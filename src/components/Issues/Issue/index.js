import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { Modal } from 'antd';
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
      title={<a onClick={e => e.preventDefault()} href={`https://github.com/${info.owner}/${info.repo}/issues/${info.number}`}>{info.title}</a>}
      visible={this.state.visible}
      onCancel={() => this.onCancel()}
      footer={null}
      destroyOnClose
      maskClosable
    >
      {undefined === this.state.detail && <Loading />}
      {null === this.state.detail && <Loading />}
      {this.state.detail && <Marked context={this.state.detail.body} />}
    </Modal>);
  }
}

Issue.propTypes = {
  info: PropTypes.object,
};

export default Issue;
