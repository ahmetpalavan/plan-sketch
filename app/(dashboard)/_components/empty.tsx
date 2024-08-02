import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

interface EmptySearchProps {
  favorites?: boolean;
  search?: boolean;
  Icon: LucideIcon;
}

export const Empty: FC<EmptySearchProps> = ({ favorites, search, Icon }) => {
  const getTitle = () => {
    if (search) return 'No boards found';
    if (favorites) return 'No favorite boards';
    return 'No boards found';
  };

  const getMessage = () => {
    if (search) return 'Try searching for something else';
    if (favorites) return 'Add boards to your favorites to see them here';
    return 'Create a new board or invite your team';
  };

  return (
    <div className='flex flex-col items-center justify-center h-[calc(100%-80px)]'>
      <Icon className='h-12 w-12 text-muted-foreground' />
      <p className='text-lg font-semibold mt-4'>{getTitle()}</p>
      <p className='text-sm text-gray-500 mt-2'>{getMessage()}</p>
    </div>
  );
};
