'use client';

import { Loader } from 'lucide-react';
import { InfoSkeleton } from './info';
import { ParticipantsSkeleton } from './participants';
import { ToolbarSkeleton } from './toolbar';

export const CanvasLoading = () => {
  return (
    <main className='h-screen w-full relative flex items-center justify-center bg-neutral-100/20 touch-none'>
      <Loader className='w-8 h-8 animate-spin text-muted-foreground' />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};
