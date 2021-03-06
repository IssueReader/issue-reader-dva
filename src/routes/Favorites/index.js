import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Button, Card, Pagination } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../components/PageBody';
import Issues from '../../components/Issues';
import styles from './index.module.less';

class Favorites extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onRefresh = this.onRefresh.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.updateIssue = this.updateIssue.bind(this);
  }
  onRefresh() {
    this.props.dispatch(
      routerRedux.push({
        pathname: this.props.location.pathname,
        search: this.props.location.search,
      }),
    );
  }
  onPageChange(page) {
    const parsed = queryString.parse(this.props.location.search);
    this.props.dispatch(
      routerRedux.push({
        pathname: this.props.location.pathname,
        search: queryString.stringify({ ...parsed, page: 1 === page ? undefined : page }),
      }),
    );
  }
  updateIssue(info) {
    this.props.dispatch({ type: 'favorites/updateIssue', payload: info });
  }
  render() {
    return (
      <React.Fragment>
        <PageHeader
          title="我的收藏"
          action={
            <Button type="primary" onClick={this.onRefresh}>
              刷新
            </Button>
          }
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            <Issues list={this.props.list} loading={this.props.loading} updateIssue={this.updateIssue} />
            <Pagination
              className={styles.pagination}
              current={this.props.page}
              showQuickJumper
              pageSize={this.props.pageSize}
              total={this.props.total}
              showTotal={t => `共 ${t} 项`}
              onChange={this.onPageChange}
            />
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}

Favorites.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  loading: state.favorites.loading,
  list: state.favorites.list,
  total: state.favorites.total,
  page: state.favorites.page,
  pageSize: state.favorites.pageSize,
}))(Favorites);
