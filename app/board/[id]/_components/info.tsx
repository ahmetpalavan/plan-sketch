'use client';

import { useQuery } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Action } from '~/components/actions';
import { Hint } from '~/components/hint';
import { Button } from '~/components/ui/button';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useRenameModal } from '~/hooks/use-rename-modal';
import { cn } from '~/lib/utils';
import { convex } from '~/providers/convex-client-provider';
import logo from '~/public/logo.png';

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  weight: ['600', '700'],
  subsets: ['latin'],
});

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const { data } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => await convex.query(api.board.get, { id: boardId as Id<'board'> }),
    refetchInterval: 1000,
  });

  if (!data) return <InfoSkeleton />;

  return (
    <div className='absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-md px-1.5 h-12 flex items-center shadow-md'>
      <Hint side='bottom' sideOffset={10} label='Go to Board'>
        <Button asChild className='px-2' variant='board'>
          <Link href='/'>
            <Image src={logo} alt='Board Logo' width={36} height={36} className='rounded-md' />
            <span className={cn('text-sm font-semibold ml-2 text-black dark:text-muted-foreground', font.className)}>Board</span>
          </Link>
        </Button>
      </Hint>
      <TabSeperator />
      <Hint label='Edit Title' side='bottom' sideOffset={10}>
        <Button onClick={() => onOpen(data._id, data.title)} className='px-2' variant='board'>
          <span className='text-sm font-semibold text-black dark:text-muted-foreground'>{data?.title}</span>
        </Button>
      </Hint>
      <TabSeperator />
      <Action id={data._id} title={data.title} side='bottom' sideOffset={10}>
        <div>
          <Hint label='Main Menu' side='bottom' sideOffset={10}>
            <Button variant='board' size='icon'>
              <Menu className='text-black dark:text-muted-foreground' size={24} />
            </Button>
          </Hint>
        </div>
      </Action>
    </div>
  );
};

export const InfoSkeleton = () => {
  return <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 w-[300px] flex items-center shadow-md' />;
};

const TabSeperator = () => {
  return <div className='dark:text-muted-foreground text-neutral-300 px-1.5'>|</div>;
};
