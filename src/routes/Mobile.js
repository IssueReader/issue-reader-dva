import React from 'react';
// import { connect } from 'dva';
// import { Icon } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';


const Mobile = () => {
  return <Exception type="500" title={<React.Fragment />} desc="抱歉，请使用 PC 访问" actions={[]} />;
};

// function mapStateToProps(state) {
//   return { ...state.client };
// }

// export default Show;
export default Mobile;
