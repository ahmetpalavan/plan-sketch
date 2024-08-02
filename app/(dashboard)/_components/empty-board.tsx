'use client';

import { useOrganization } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { Notebook } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { api } from '~/convex/_generated/api';
import { useApiMutation } from '~/hooks/use-api-mutation';

export const EmptyBoard = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = useCallback(() => {
    if (!organization) {
      return;
    }
    mutate({
      orgId: organization.id,
      title: 'New board',
    })
      .then(() => {
        toast.success('Board created');
      })
      .catch(() => {
        toast.error('Failed to create board');
      });
  }, [mutate, organization]);

  return (
    <div className='flex flex-col items-center justify-center h-[calc(100%-80px)]'>
      <Notebook className='h-12 w-12 text-muted-foreground' />
      <p className='text-lg font-semibold mt-4'>Create your first board</p>
      <p className='text-sm text-gray-500 mt-2'>Start by creating a board to organize your tasks</p>
      <Button disabled={pending} onClick={onClick} className='mt-4'>
        Create a board
      </Button>
    </div>
  );
};
