import { format } from 'date-fns';

import noPoster from '../assets/noPoster.svg';

export default class Utils {
  dateFormat(date) {
    if (date) {
      return format(new Date(date), 'MMMM dd, yyyy');
    } else {
      return 'Is unknown';
    }
  }

  hasPoster(poster) {
    return poster ? `https://image.tmdb.org/t/p/original${poster}` : noPoster;
  }

  movieData(movie) {
    return {
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average.toFixed(1),
      date: this.dateFormat(movie.release_date),
      genre: movie.genre_ids,
      description: movie.overview,
      poster: this.hasPoster(movie.poster_path),
    };
  }
}
