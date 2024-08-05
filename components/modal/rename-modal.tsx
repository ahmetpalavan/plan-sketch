'use client';

import { useMutation } from '@tanstack/react-query';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useRenameModal } from '~/hooks/use-rename-modal';
import { convex } from '~/providers/convex-client-provider';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

export const RenameModal = () => {
  const { isOpen, initialValues, onClose } = useRenameModal();

  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      convex.mutation(api.board.update, {
        id: initialValues.id as Id<'board'>,
        title,
      }),
    onSuccess: () => {
      toast.success(`Board "${title}" renamed successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to rename board "${title}"`);
    },
  });

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      mutate();
    },
    [mutate, title]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription>Enter a new name for the board</DialogDescription>
        <form onSubmit={onSubmit} className='space-y-4'>
          <Input
            disabled={isPending}
            required
            maxLength={60}
            value={title}
            placeholder='Board Title'
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary' onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type='submit' variant='default'>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
