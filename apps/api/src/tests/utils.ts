import cloneDeep from 'lodash/cloneDeep';

import { initApp } from '@/app';
import { MockMoviesSearchEngineService } from '@/common/infrastructure/moviesSearchEngine/MoviesSearchEngineService.mock';
import { DatabaseSchema } from '@/config/database/connectJSONDb';
import { AuthService, authMiddleware } from '@/modules/auth';
import { MockAuthRepository } from '@/modules/auth/services/authRepository/authRepository.mock';
import { MoviesService } from '@/modules/movies';
import { MockMoviesRepository } from '@/modules/movies/services/moviesRepository/moviesRepository.mock';

const initialData: DatabaseSchema = {
  genres: ['Action', 'Crime'],
  movies: [
    {
      director: 'Johnny',
      genres: ['Action'],
      id: 1,
      runtime: 123,
      title: 'Rose',
      year: 2005,
    },
    {
      director: 'James A',
      genres: ['Crime'],
      id: 2,
      runtime: 83,
      title: 'Twelling jo',
      year: 1992,
    },
  ],
  users: [],
};

export function createTestingApp(testSpecificData?: Partial<DatabaseSchema>) {
  const dbData = cloneDeep({ ...initialData, ...testSpecificData });

  const moviesRepository = MockMoviesRepository({ genres: dbData.genres, movies: dbData.movies });
  const moviesSearchEngineService = MockMoviesSearchEngineService();
  const moviesService = MoviesService(moviesRepository, moviesSearchEngineService);

  const authRepository = MockAuthRepository(dbData.users);
  const authService = AuthService(authRepository);

  return {
    app: initApp({
      authMiddleware,
      authService,
      moviesSearchEngineService,
      moviesService,
    }),
    initialData,
  };
}
