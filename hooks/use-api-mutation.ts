import { useMutation } from 'convex/react';
import { useState } from 'react';

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState<boolean>(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (variables: any) => {
    setPending(true);
    try {
      await apiMutation(variables);
    } catch (error) {
      console.error(error);
    }
    setPending(false);
  };

  return { mutate, pending };
};
