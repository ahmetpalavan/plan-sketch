import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen animate-spin '>
      <Loader2 size='48' />
    </div>
  );
};
