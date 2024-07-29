'use client';

import { Plus } from 'lucide-react';
import { CreateOrganization } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Hint } from '~/components/hint';

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='aspect-square'>
          <Hint label='Create a new organization' align='start' side='right' sideOffset={4}>
            <button className='w-full h-full flex items-center justify-center bg-white/20 rounded-lg transition-colors duration-200 hover:bg-white/30'>
              <Plus />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className='p-4 bg-transparent border-none max-w-[480px]'>
        <CreateOrganization routing='hash' />
      </DialogContent>
    </Dialog>
  );
};
