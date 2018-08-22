import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Progress } from 'antd';
import styles from './index.module.less';


const Updating = ({ percent }) => {
  return (<div className={styles.flex}>
    <div className={styles.loading}>
      <div className={styles.text}>loading</div>
      <div className={styles.percent}>{percent}%</div>
      <Progress percent={percent} showInfo={false} strokeWidth={1} status="active" />
    </div>
  </div>);
};

Updating.propTypes = {
  percent: PropTypes.number,
};

export default connect(state => ({
  percent: state.app.percent,
}))(Updating);
