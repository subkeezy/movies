import { Tabs } from 'antd';
import { Component } from 'react';

import MovieList from '../MovieList/MovieList';
import MovieSearch from '../MovieSearch/MovieSearch';
import MovieService from '../../Services/MovieService';
import MovieGenresContext from '../MovieGenresContext/MovieGenresContext';
import './MovieTabs.css';

export default class MovieTabs extends Component {
  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      searchError: false,
      isLoaded: false,
      items: [],
      popularMovies: null,
      inputValue: null,
      totalPages: null,
      currentPage: 1,
      ratedItems: [],
      ratedTab: false,
      allGenres: this.getGenres(),
      popularMoviesTotalPages: 1,
      searchMoviesTotalPages: 1,
      ratedPage: 1,
      wasPage: 1,
    };
  }

  movieState(error, searchError, isLoaded, items, popularMovies, inputValue, totalPages, currentPage) {
    this.setState({
      error: error,
      searchError: searchError,
      isLoaded: isLoaded,
      items: items,
      popularMovies: popularMovies,
      inputValue: inputValue,
      totalPages: totalPages,
      currentPage: currentPage,
    });
  }

  componentDidMount() {
    const { currentPage } = this.state;
    this.movieService.guestSession();
    this.onEmptyInput(currentPage);
    this.getGenres();
  }

  onError = () => {
    this.movieState(null, true, true, []);
  };

  getGenres() {
    this.movieService.getGenres().then(
      (genres) => {
        this.setState({
          allGenres: genres.genres,
        });
      },
      (error) => {
        this.setState({ error });
      }
    );
  }

  onEmptyInput(page) {
    this.movieService
      .getPopularMovies(page)
      .then(
        (items) => {
          this.setState({
            popularMoviesTotalPages: 20,
            wasPage: page,
          });
          this.movieState(null, null, true, items.data, true, null, 20, page);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      )
      .catch((err) => this.onError(err));
  }

  onMovieSearch = (input, page) => {
    this.movieService
      .getMovieByWord(input, page)
      .then(
        (items) => {
          if (input.length === 0) {
            this.setState({
              isLoaded: true,
              items: [],
              inputValue: this.onEmptyInput(page),
            });
          } else if (items.data.length === 0) {
            this.movieState(null, null, true, []);
            throw new Error('Фильмов не найдено');
          } else {
            this.setState({
              searchMoviesTotalPages: items.totalPages,
              wasPage: page,
            });
            this.movieState(null, null, true, items.data, null, input, items.totalPages, page);
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            items: [],
            error,
          });
        }
      )
      .catch((err) => this.onError(err));
  };

  onPageChange(page) {
    const { inputValue, popularMovies, ratedTab } = this.state;
    this.setState({
      currentPage: page,
      isLoaded: false,
    });
    if (popularMovies) {
      this.onEmptyInput(page);
    } else if (ratedTab && !popularMovies) {
      this.getRatedMovies(page);
    } else {
      this.onMovieSearch(inputValue, page);
    }
  }

  onRatingChange(rating, id) {
    const { items, ratedItems } = this.state;
    const index = ratedItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      ratedItems[index].rating = rating;
    } else {
      const movie = items.find((item) => item.id === id);
      ratedItems.push({
        ...movie,
        rating,
      });
    }
    this.setState({
      ratedItems: [...ratedItems],
    });
    localStorage.setItem('ratedItems', JSON.stringify(this.state.ratedItems));
  }

  onUserRatingChange(rating, id) {
    this.movieService.rateMovies(rating, id).then((res) => res);
    this.setState((prevState) => ({
      userRating: {
        ...prevState.userRating,
        [id]: rating,
      },
    }));

    const userRating = JSON.parse(localStorage.getItem('userRating')) || {};
    userRating[id] = rating;
    localStorage.setItem('userRating', JSON.stringify(userRating));
  }

  getRatedMovies(page) {
    this.movieService.ratedMovies(page).then((res) => {
      this.setState({
        isLoaded: true,
        ratedItems: res.data,
        totalPages: res.totalPages,
        ratedTab: true,
        ratedPage: res.page,
      });
    });
  }

  render() {
    const { totalPages, allGenres, popularMoviesTotalPages, inputValue, searchMoviesTotalPages, wasPage, ratedPage } =
      this.state;
    return (
      <MovieGenresContext.Provider value={allGenres}>
        <div className="movie-tabs">
          <Tabs
            centered
            onTabClick={(key) => {
              if (key === '2') {
                this.setState({ isLoaded: false, ratedTab: true, currentPage: ratedPage, popularMovies: false });
                this.getRatedMovies(ratedPage);
              } else if (key === '1') {
                inputValue
                  ? this.setState({
                      popularMovies: false,
                      totalPages: searchMoviesTotalPages,
                      currentPage: wasPage,
                    })
                  : this.setState({
                      popularMovies: true,
                      totalPages: popularMoviesTotalPages,
                      currentPage: wasPage,
                    });
                this.setState({
                  ratedTab: false,
                });
              }
            }}
          >
            <Tabs.TabPane tab="Search" key={1}>
              <MovieSearch state={this.state} onMovieSearch={this.onMovieSearch.bind(this)} />
              <MovieList
                state={this.state}
                onPageChange={this.onPageChange.bind(this)}
                totalPages={totalPages}
                onRatingChange={this.onRatingChange.bind(this)}
                onUserRatingChange={this.onUserRatingChange.bind(this)}
                currentPage={this.state.currentPage}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Rated" key={2} onChange={this.getRatedMovies.bind(this)}>
              <MovieList
                state={{ ...this.state, items: this.state.ratedItems }}
                onPageChange={this.onPageChange.bind(this)}
                totalPages={totalPages}
                onRatingChange={this.onRatingChange.bind(this)}
                getRatedMovies={this.getRatedMovies.bind(this)}
                onUserRatingChange={this.onUserRatingChange.bind(this)}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </MovieGenresContext.Provider>
    );
  }
}
