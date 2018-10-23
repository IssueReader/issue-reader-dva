import React from 'react';
import { Icon } from 'antd';
import styles from './index.module.less';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <Icon type="loading" />
    </div>
  );
};

export default Loading;
