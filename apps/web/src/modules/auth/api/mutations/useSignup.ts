import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authAPI } from '../authAPIService';
import { queryKeys } from '../queryKeys';

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.signup,
    onSettled: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}
