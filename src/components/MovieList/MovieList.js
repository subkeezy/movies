import { Component } from 'react';
import './MovieList.css';
import { Alert, Row } from 'antd';

import SearchError from '../SearchError/SearchError';
import MovieItem from '../MovieItem/MovieItem';
import MoviePagination from '../MoviePagination/MoviePagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default class MovieList extends Component {
  render() {
    const { error, isLoaded, items, searchError, popularMovies, currentPage, ratedTab } = this.props.state;
    const { onPageChange, totalPages, onRatingChange, getRatedMovies, onUserRatingChange } = this.props;
    const elements = items.map((el) => {
      return <MovieItem key={el.id} {...el} onRatingChange={onRatingChange} onUserRatingChange={onUserRatingChange} />;
    });
    const pagination =
      !isLoaded && !error && !searchError ? (
        <LoadingSpinner />
      ) : items.length !== 0 && !error && !searchError && isLoaded ? (
        <MoviePagination
          state={this.props.state}
          onPageChange={onPageChange}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      ) : !isLoaded && ratedTab && items.length === 0 && !error && !searchError ? (
        <LoadingSpinner />
      ) : ratedTab && items.length === 0 && !error && !searchError ? (
        <div className="no-movies">No rated movies yet</div>
      ) : null;

    const popularMoviesTitle =
      popularMovies && !error && !getRatedMovies && isLoaded ? (
        <h1 className="popular-movies-title">Popular movies</h1>
      ) : null;

    const networkError = error ? (
      <Alert
        message="Запрос данных отклонен. Попробуйте позже."
        type="error"
        showIcon
        className="network-error"
        style={{
          margin: 'auto',
          textAlign: 'center',
          fontSize: 20,
          marginTop: 20,
        }}
      />
    ) : null;

    const onSearchError = searchError ? <SearchError /> : null;

    return (
      <div className="movie__list">
        {popularMoviesTitle}
        {onSearchError}
        {networkError}
        <Row
          className="list_grid"
          gutter={[36, 23]}
          style={{
            boxSizing: 'border-box',
            margin: 0,
            paddingTop: 21,
          }}
        >
          {elements}
        </Row>
        {pagination}
      </div>
    );
  }
}
