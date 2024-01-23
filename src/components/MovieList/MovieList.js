import { Component } from 'react';
import './MovieList.css';
import { Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MovieItem from '../MovieItem/MovieItem';
import MovieService from '../../Services/MovieService';

export default class MovieList extends Component {
  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    this.movieService.getMovieByWord('anime').then(
      (movie) => {
        this.setState({
          isLoaded: true,
          items: movie,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }

  render() {
    const { error, isLoaded, items } = this.state;
    console.log(items);

    const elements = items.map((el) => {
      const { id, ...elProps } = el;
      return <MovieItem key={id} {...elProps} />;
    });

    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div
          style={{
            marginLeft: '45%',
            marginTop: '20%',
            fontSize: 20,
            display: 'flex',
            columnGap: 15,
          }}
        >
          Загрузка <LoadingOutlined />
        </div>
      );
    } else {
      return (
        <div className="movie__list">
          <Row
            gutter={[36, 36]}
            justify="space-between"
            style={{
              boxSizing: 'border-box',
              margin: 0,
              padding: '21px 36px',
            }}
          >
            {elements}
          </Row>
        </div>
      );
    }
  }
}
