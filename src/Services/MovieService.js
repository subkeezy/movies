import { format } from 'date-fns';

export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3';
  _apiKey = 'api_key=5bf0b9fe943305154eb08e9564cfba0f';

  async getResource(url) {
    const res = await fetch(`${this._baseUrl}${url}${this._apiKey}`);
    if (!res.ok) {
      throw new Error(`Cound not fetch ${this._baseUrl}${url}${this._apiKey} recieved ${res.status}`);
    }
    return await res.json();
  }

  async getPopularMovies() {
    const res = await this.getResource(`/movie/popular?`);
    return res.results.map((el) => this.movieData(el));
  }

  async getMovieByWord(word) {
    const res = await this.getResource(`/search/movie?query=${word}&`);
    const filtered = await res.results.filter((el) => el.poster_path !== null);
    return filtered.map((el) => this.movieData(el));
  }

  dateFormat(date) {
    return format(new Date(date), 'MMMM dd, yyyy');
  }

  movieData(movie) {
    return {
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average.toFixed(1),
      date: this.dateFormat(movie.release_date),
      genre: ['Action', 'Drama'],
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    };
  }
}

// const movies = new MovieService();

// movies.getMovieByWord('return').then((res) => {
//   console.log(res)
// });

// movies.getPopularMovies().then((titles) => {
//   titles.forEach(element => {
//     console.log(element.title)
//   });
// });

// movies.getMovie(5).then((body) => {
//   console.log(body)
// });

// getResource('https://api.themoviedb.org/3/movie/2?api_key=5bf0b9fe943305154eb08e9564cfba0f')
//   .then((body) => {
//     console.log(body)
//   })
//   .catch((err) => {
//     console.error('Could not fetch', err)
//   })
