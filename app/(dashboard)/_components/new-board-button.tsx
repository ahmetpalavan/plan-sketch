import { Plus } from 'lucide-react';
import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { useApiMutation } from '~/hooks/use-api-mutation';
import { cn } from '~/lib/utils';

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

export const NewBoardButton: React.FC<NewBoardButtonProps> = ({ orgId, disabled }) => {
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = useCallback(() => {
    mutate({ orgId, title: 'New Board' })
      .then(() => {
        toast.success('Board created');
      })
      .catch(() => {
        toast.error('Failed to create board');
      });
  }, [orgId]);

  return (
    <button
      disabled={disabled || pending}
      onClick={onClick}
      className={cn(
        'col-span-1 group aspect-[100/127] border rounded-lg flex flex-col items-center justify-center py-6 bg-blue-600 hover:bg-blue-900',
        (disabled || pending) && 'opacity-75'
      )}
    >
      <div />
      <Plus className='w-12 h-12 text-white mx-auto' />
      <p className='text-white text-center text-sm mt-2'>New board </p>
    </button>
  );
};
