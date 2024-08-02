import React from 'react';
import { Bird } from 'lucide-react';
import { CreateOrganization } from '@clerk/nextjs';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

export const EmptyOrg = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-[calc(100%-80px)]'>
      <Bird size={64} className='text-muted-foreground' />
      <h2 className='text-lg text-muted-foreground font-bold mt-3'>Welcome to Board</h2>
      <p className='text-muted-foreground text-sm mt-1 leading-6'>Create a new organization to get started.</p>
      <Dialog>
        <DialogTrigger>
          <Button className='mt-4'>Create Organization</Button>
        </DialogTrigger>
        <DialogContent className='bg-transparent p-0 border-none max-w-[480px]'>
          <CreateOrganization routing='hash' />
        </DialogContent>
      </Dialog>
    </div>
  );
};
