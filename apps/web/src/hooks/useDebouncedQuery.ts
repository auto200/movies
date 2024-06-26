import {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';

type Config = {
  debounceMs: number;
  omitDebounceOnCacheHit: boolean;
};

// NOTE: type definitions are just a copy paste of `useQuery` type definition
/**
 *
 * @param options UseQueryOptions, MUST BE MEMOIZED to avoid infinite loop
 * @param config
 * @returns
 */
export function useDebouncedQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  config: Config = { debounceMs: 500, omitDebounceOnCacheHit: true }
): UseQueryResult<TData, TError> {
  const [debouncedOptions] = useDebounceValue(options, config.debounceMs);
  const qc = useQueryClient();

  const isCached =
    config.omitDebounceOnCacheHit && options.queryKey ? !!qc.getQueryData(options.queryKey) : false;

  return useQuery(isCached ? options : debouncedOptions);
}
