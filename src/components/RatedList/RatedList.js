import { Component } from 'react';
import { Alert, Row, Spin } from 'antd';

import MovieItem from '../MovieItem/MovieItem';
import MoviePagination from '../MoviePagination/MoviePagination';

export default class RatedList extends Component {
  render() {
    const { error, isLoaded, items } = this.props.state;
    const { onPageChange, totalPages, onRatingChange } = this.props;
    const elements = items.map((el) => {
      return <MovieItem key={el.id} {...el} onRatingChange={onRatingChange} />;
    });
    const pagination =
      !error && isLoaded && items.length === 20 ? (
        <MoviePagination state={this.props.state} onPageChange={onPageChange} totalPages={totalPages} />
      ) : null;

    const networkError = error ? (
      <Alert
        message="Запрос данных отклонен. Попробуйте позже."
        type="error"
        showIcon
        style={{
          margin: 'auto',
          textAlign: 'center',
          fontSize: 20,
        }}
      />
    ) : null;

    const loading = !isLoaded ? (
      <div
        style={{
          marginLeft: '45%',
          marginTop: '20%',
          fontSize: 20,
          display: 'flex',
          columnGap: 15,
        }}
      >
        Загрузка <Spin />
      </div>
    ) : null;

    return (
      <>
        <Row
          gutter={[36, 30]}
          justify="space-between"
          style={{
            boxSizing: 'border-box',
            margin: 0,
            paddingTop: 21,
          }}
        >
          {elements}
          {networkError}
          {loading}
        </Row>
        {pagination}
      </>
    );
  }
}
