import dva from 'dva';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import { createLogger } from 'redux-logger';
// import 'antd/dist/antd.less';
import 'ant-design-pro/dist/ant-design-pro.css';

import './index.less';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});
app.use(createLoading());
app.use({ onAction: createLogger() });

// 3. Model
app.model(require('./models/app').default);
// app.model(require('./models/repo').default);
// app.model(require('./models/issues').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
