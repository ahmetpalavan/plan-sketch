import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Action } from '~/components/actions';
import { Skeleton } from '~/components/ui/skeleton';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convex } from '~/providers/convex-client-provider';
import { Footer } from './footer';
import { Overlay } from './overlay';

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

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, createdAt, isFavorite, orgId }: BoardCardProps) => {
  const { userId } = useAuth();

  const isAuthor = userId === authorId ? 'You' : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  const { mutate: favorite, isPending: isFavoritePending } = useMutation({
    mutationFn: () => {
      return convex.mutation(api.board.favorite, {
        id: id as Id<'board'>,
        orgId: orgId,
      });
    },
    onSuccess: () => {
      toast.success('Board favorited');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: unfavorite, isPending: isUnfavoritePending } = useMutation({
    mutationFn: () => {
      return convex.mutation(api.board.unfavorite, {
        id: id as Id<'board'>,
      });
    },
    onSuccess: () => {
      toast.error('Board unfavorited');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      unfavorite();
    } else {
      favorite();
    }
  }, [isFavorite, favorite, unfavorite]);

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
          onClick={toggleFavorite}
          disabled={isFavoritePending || isUnfavoritePending}
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
