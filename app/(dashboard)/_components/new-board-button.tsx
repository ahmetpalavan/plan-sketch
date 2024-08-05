import { Plus } from 'lucide-react';
import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { useMutation } from '@tanstack/react-query';
import { cn } from '~/lib/utils';
import { convex } from '~/providers/convex-client-provider';

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

export const NewBoardButton: React.FC<NewBoardButtonProps> = ({ orgId, disabled }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => convex.mutation(api.board.create, { orgId, title: 'New board' }),
    onSuccess: () => {
      toast.success('Board created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onClick = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <button
      disabled={disabled || isPending}
      onClick={onClick}
      className={cn(
        'col-span-1 group aspect-[100/127] border rounded-lg flex flex-col items-center justify-center py-6 from-yellow-700 to-yellow-300 bg-gradient-to-t transition-opacity duration-200 hover:opacity-90',
        (disabled || isPending) && 'opacity-75'
      )}
    >
      <div />
      <Plus className='w-12 h-12 text-white mx-auto' />
      <p className='text-white text-center text-sm mt-2'>New board </p>
    </button>
  );
};
