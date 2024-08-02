import { Plus } from 'lucide-react';
import { OrganizationProfile } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' size='sm' className='flex items-center justify-center gap-x-2'>
          <Plus size={16} />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-transparent p-0 border-none max-w-[880px]'>
        <OrganizationProfile routing='hash' />
      </DialogContent>
    </Dialog>
  );
};
