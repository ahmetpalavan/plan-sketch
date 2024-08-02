import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { cn } from '~/lib/utils';
import { convex } from '~/providers/convex-client-provider';

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

export const NewBoardButton: React.FC<NewBoardButtonProps> = ({ orgId, disabled }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (orgId: string) =>
      convex
        .mutation(api.board.create, {
          orgId: orgId,
          title: 'New board',
        })
        .then(() => {
          toast.success('Board created');
        })
        .catch(() => {
          toast.error('Failed to create board');
        }),
  });

  return (
    <button
      disabled={disabled || isPending}
      onClick={() => mutate(orgId)}
      className={cn(
        'col-span-1 group aspect-[100/127] border rounded-lg flex flex-col items-center justify-center py-6 bg-blue-600 hover:bg-blue-900',
        (disabled || isPending) && 'opacity-75'
      )}
    >
      <div />
      <Plus className='w-12 h-12 text-white mx-auto' />
      <p className='text-white text-center text-sm mt-2'>New board </p>
    </button>
  );
};