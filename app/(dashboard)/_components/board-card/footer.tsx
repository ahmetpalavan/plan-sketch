import { Star } from 'lucide-react';
import { useCallback } from 'react';
import { cn } from '~/lib/utils';

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Footer: React.FC<FooterProps> = ({ title, authorLabel, createdAtLabel, isFavorite, onClick, disabled }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      onClick();
    },
    [onClick]
  );

  return (
    <div className='relative p-3'>
      <p className='text-sm text-muted-foreground dark:text-white truncate max-w-[calc(100%-20px)]'>{title}</p>
      <p className='opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground dark:text-white truncate'>
        {authorLabel}, {createdAtLabel}
      </p>
      <button
        className={cn(
          'opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600',
          disabled && 'cursor-not-allowed opacity-75'
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        <Star className={cn('w-5 h-5', isFavorite && 'fill-blue-600 text-blue-600')} />
      </button>
    </div>
  );
};
