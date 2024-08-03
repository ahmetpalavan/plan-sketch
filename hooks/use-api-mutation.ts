import { useMutation } from 'convex/react';
import { useState } from 'react';

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState<boolean>(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = (variables: any) => {
    setPending(true);
    return apiMutation(variables)
      .finally(() => setPending(false))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  return { mutate, pending };
};
