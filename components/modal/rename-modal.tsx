'use client';
import { toast } from 'sonner';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRenameModal } from '~/hooks/use-rename-modal';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useApiMutation } from '~/hooks/use-api-mutation';
import { api } from '~/convex/_generated/api';

export const RenameModal = () => {
  const { isOpen, initialValues, onClose } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.update);
  const [title, setTitle] = useState(initialValues.title);
  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutate({
        id: initialValues.id,
        title,
      })
        .then(() => {
          toast.success(`Board "${title}" renamed`);
          onClose();
        })
        .catch(() => {
          toast.error(`Failed to rename board "${title}"`);
        });
    },
    [title, initialValues, mutate, pending, onClose]
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
            disabled={pending}
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
            <Button disabled={pending} type='submit' variant='default'>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
