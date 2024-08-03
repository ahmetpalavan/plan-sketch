import { Skeleton } from '~/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Overlay } from './overlay';
import { useAuth } from '@clerk/nextjs';
import { Footer } from './footer';
import { Action } from '~/components/actions';
import { MoreHorizontal } from 'lucide-react';

interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  orgId: string;
  authorName: string;
  createdAt: number;
  isFavorite: boolean;
}

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, createdAt, isFavorite }: BoardCardProps) => {
  const { userId } = useAuth();

  const isAuthor = userId === authorId ? 'You' : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Link href={`/board/${id}`}>
      <div className='group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden'>
        <div className='relative flex-1 bg-amber-50'>
          <Image src={imageUrl} alt={title} fill className='object-fit' />
          <Overlay />
          <Action id={id} title={title} side='right' sideOffset={8}>
            <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none'>
              <MoreHorizontal className='opacity-70 hover:opacity-100 transition-opacity' />
            </button>
          </Action>
        </div>
        <Footer
          title={title}
          authorLabel={isAuthor}
          createdAtLabel={createdAtLabel}
          isFavorite={isFavorite}
          onClick={() => {}}
          disabled={false}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className='aspect-[100/127] rounded-lg'>
      <Skeleton className='w-full h-full' />
    </div>
  );
};
