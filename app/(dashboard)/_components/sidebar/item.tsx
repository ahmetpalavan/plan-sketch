'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';
import { useCallback } from 'react';
import { Hint } from '~/components/hint';
import { cn } from '~/lib/utils';

type Props = {
  id: string;
  name: string;
  imageUrl: string;
};

export const SidebarItem = ({ id, name, imageUrl }: Props) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = useCallback(() => {
    if (!isActive) return;
    setActive?.({
      organization: id,
    });
  }, [id, isActive, setActive]);

  return (
    <div className='aspect-square relative'>
      <Hint label={name} align='start' side='right' sideOffset={4}>
        <Image
          fill
          onClick={onClick}
          alt={name}
          src={imageUrl}
          className={cn(
            'object-cover opacity-75 hover:opacity-100 cursor-pointer rounded-lg transition-colors duration-200',
            isActive && 'opacity-100'
          )}
        />
      </Hint>
    </div>
  );
};
