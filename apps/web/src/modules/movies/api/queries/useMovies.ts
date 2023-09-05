import { moviesAPI } from "../moviesAPIService";
import { GetMovieFiltersDTO } from "@movies/shared/communication";
import { useDebouncedQuery } from "common/hooks/useDebouncedQuery";
import { useMemo } from "react";
import { useDeepCompareMemoize } from "use-deep-compare-effect";

export function useMovies(filters: GetMovieFiltersDTO) {
  const memoFilters = useDeepCompareMemoize(filters);

  return useDebouncedQuery(
    useMemo(
      () => ({
        queryKey: ["movies", memoFilters],
        queryFn: () => moviesAPI.getMovies(memoFilters),
      }),
      [memoFilters]
    )
  );
}
