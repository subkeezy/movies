import { Component } from 'react';
import { Card, Col, Rate } from 'antd';

import './MovieItem.css';

export default class MovieItem extends Component {
  descriptionLimit = (text, maxLength) => {
    if (text.length > maxLength && this.props.title.length >= 40) {
      return text.slice(0, maxLength - 150) + '...';
    } else if (text.length > maxLength && this.props.title.length >= 30) {
      return text.slice(0, maxLength - 100) + '...';
    } else if ((text.length > maxLength && this.props.title.length > 20) || this.props.title.length < 30) {
      return text.slice(0, maxLength - 60) + '...';
    } else if (text.length > maxLength && this.props.title.length < 20) {
      return text.slice(0, maxLength - 20) + '...';
    } else {
      return text;
    }
  };

  render() {
    const { title, rating, date, genre, description, poster } = this.props;

    const genreItem = genre.map((el) => {
      return (
        <li key={Math.random()} className="genre-item">
          {el}
        </li>
      );
    });

    return (
      <Col
        style={{
          maxWidth: 454,
          padding: 0,
          boxSizing: 'border-box',
        }}
      >
        <Card
          className="card"
          hoverable
          style={{
            width: 'auto',
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
              <h1 className="title">{title}</h1>
              <span className="rating">{rating}</span>
              <p className="date">{date}</p>
              <ul className="genre-list">{genreItem}</ul>
              <p className="description">{this.descriptionLimit(description, 200)}</p>
              <Rate
                className="stars"
                count={10}
                allowHalf
                style={{
                  fontSize: 15,
                }}
              />
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
