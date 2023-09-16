/* eslint-disable @typescript-eslint/require-await */
import { MoviesRepository } from './moviesRepository';

import { DatabaseSchema } from '@/config/database/connectJSONDb';

export const createMockMoviesRepository = (initialData: DatabaseSchema): MoviesRepository => {
  const db = initialData;

  return {
    getAllMovies: async () => db.movies,
    addMovie: async (movie) => {
      db.movies.push({ ...movie, id: db.movies.length + 1 });
    },
    findByTitle: async (title) => db.movies.find((movie) => movie.title === title) ?? null,
    getGenres: async () => db.genres,
  };
};
