'use client';
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { Edit, Link2, Trash } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '~/components/confirm-modal';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useRenameModal } from '~/hooks/use-rename-modal';
import { convex } from '~/providers/convex-client-provider';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps['side'];
  sideOffset?: DropdownMenuContentProps['sideOffset'];
  id: string;
  title: string;
}

export const Action = ({ children, side, sideOffset, id, title }: ActionProps) => {
  const { onOpen } = useRenameModal();

  const { mutate, isPending } = useMutation({
    mutationFn: () => convex.mutation(api.board.remove, { id: id as Id<'board'> }),
    onSuccess: () => {
      toast.success('Board deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = useCallback(() => {
    mutate();
  }, [mutate]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => {
        toast.success('Board link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy board link');
      });
  }, [id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='w-60'
        side={side}
        sideOffset={sideOffset}
      >
        <DropdownMenuItem className='p-3 cursor-pointer' onClick={handleCopyLink}>
          <Link2 size={16} className='mr-2' />
          Copy Board Link
        </DropdownMenuItem>
        <DropdownMenuItem className='p-3 cursor-pointer' onClick={() => onOpen(id, title)}>
          <Edit size={16} className='mr-2' />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          disabled={isPending}
          header='Delete Board'
          description='Are you sure you want to delete this board?'
          onConfirm={handleDelete}
        >
          <Button variant={'ghost'} className='w-full p-3 text-left justify-start font-normal cursor-pointer'>
            <Trash size={16} className='mr-2' />
            Delete Board
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
