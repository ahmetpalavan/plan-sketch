'use client';

import { useQuery } from 'convex/react';
import { Search, Star } from 'lucide-react';
import { FC } from 'react';
import { api } from '~/convex/_generated/api';
import { BoardCard } from './board-card';
import { Empty } from './empty';
import { EmptyBoard } from './empty-board';
import { NewBoardButton } from './new-board-button';

interface BoardListProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: string;
}

export const BoardList: FC<BoardListProps> = ({ query, orgId }) => {
  const data = useQuery(api.boards.get, { orgId, ...query });

  if (data === undefined) {
    return (
      <div>
        <h2 className='text-3xl'>{query.favorites ? 'Favorite boards' : 'Boards'}</h2>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-8 pb-10 md:grid-cols-4'>
          <NewBoardButton orgId={orgId} />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data?.length && query.search) {
    return <Empty Icon={Search} search />;
  }

  if (!data?.length && query.favorites) {
    return <Empty Icon={Star} favorites />;
  }

  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <div>
      <h2 className='text-3xl'>{query.favorites ? 'Favorite boards' : 'Boards'}</h2>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-8 pb-10 md:grid-cols-4'>
        <NewBoardButton orgId={orgId} />
        {data?.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            orgId={board.orgId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
