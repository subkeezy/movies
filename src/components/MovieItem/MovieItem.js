import { useContext } from 'react';
import { Card, Col, Rate } from 'antd';

import MovieGenresContext from '../MovieGenresContext/MovieGenresContext';

import './MovieItem.css';

const MovieItem = (props) => {
  function descriptionLimit(text, maxLength) {
    const titleLength = props.title.length;
    if (text.length + titleLength <= maxLength) {
      return text;
    } else {
      const availableLength = maxLength - titleLength - 30;
      const truncatedText = text.slice(0, availableLength);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      const endIndex = lastSpaceIndex !== -1 ? lastSpaceIndex : availableLength;
      return truncatedText.slice(0, endIndex) + '...';
    }
  }

  const movieRating = (rating) => {
    if (rating < 3) {
      return <span className="rating less-three-rating">{rating}</span>;
    } else if (rating < 5) {
      return <span className="rating less-five-rating">{rating}</span>;
    } else if (rating < 7) {
      return <span className="rating less-seven-rating">{rating}</span>;
    } else {
      return <span className="rating more-seven-rating">{rating}</span>;
    }
  };

  const userRating = (id) => {
    let userRating = JSON.parse(localStorage.getItem('userRating'));
    return userRating ? userRating[id] : 0;
  };

  const { title, date, description, genre, poster, rating, onUserRatingChange, id } = props;
  const genres = useContext(MovieGenresContext);
  const elements = genre.map((el) => {
    const findGenres = genres.find((item) => item.id === el);
    return (
      <li key={Math.random()} className="genre-item">
        {findGenres.name}
      </li>
    );
  });

  return (
    <Col
      style={{
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <Card
        className="card"
        hoverable
        style={{
          padding: 0,
        }}
        bodyStyle={{
          padding: 0,
        }}
      >
        <div className="movie__card">
          <div className="card-poster">
            <img className="poster" src={poster} />
          </div>
          <div className="card-content">
            <h2 className="title">{title}</h2>
            {movieRating(rating)}
            <p className="date">{date}</p>
            <ul className="genre-list">{elements}</ul>
            <p className="description">
              {window.innerWidth <= 576 ? descriptionLimit(description, 350) : descriptionLimit(description, 170)}
            </p>
            <Rate
              className="stars"
              count={10}
              allowHalf
              style={{
                fontSize: 15,
              }}
              defaultValue={0}
              value={userRating(id)}
              onChange={(newRating) => {
                onUserRatingChange(newRating, id);
              }}
            />
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default MovieItem;
