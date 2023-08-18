import { MoviesRepository, MoviesService } from "@modules/movies";
import { DbConnection } from "./database/connectJSONDb";

export type RootService = {
  moviesService: MoviesService;
};

export function createRootService(db: DbConnection): RootService {
  const moviesRepository = MoviesRepository(db);
  const moviesService = MoviesService(moviesRepository);

  return { moviesService };
}