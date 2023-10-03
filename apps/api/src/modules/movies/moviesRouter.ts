import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { addMovieRequestDTOSchema, getMovieFiltersSchema } from '@movies/shared/communication';

import { type RootService } from '@/common/infrastructure/rootService';
import { validator } from '@/common/payloadValidation';

const validators = {
  addMovie: validator({ body: addMovieRequestDTOSchema }),
  getMovie: validator({
    query: getMovieFiltersSchema,
  }),
};

// NOTE: currently movie genres has to exactly match genres from database, including capitalization

export const createMoviesRouter = ({ moviesService }: RootService): Router => {
  const router = Router();

  router.post('/', validators.addMovie, (req, res, next) => {
    const movieToAdd = req.body;

    moviesService
      .addMovie(movieToAdd)
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch(next);
  });

  router.get('/', validators.getMovie, (req, res, next) => {
    const filters = req.query;

    const filtersActive = Object.keys(filters).length > 0;
    if (filtersActive) {
      moviesService
        .getMoviesWithFilters(filters)
        .then((movies) => res.json(movies))
        .catch(next);

      return;
    }

    moviesService
      .getRandomMovie()
      .then((movie) => res.json(movie))
      .catch(next);
  });

  router.get('/genres', (_, res, next) => {
    moviesService
      .getGenres()
      .then((genres) => res.json(genres))
      .catch(next);
  });

  router.get('/filters-metadata', (_, res, next) => {
    moviesService
      .getFiltersMetadata()
      .then((filtersMetadata) => res.json(filtersMetadata))
      .catch(next);
  });

  return router;
};
