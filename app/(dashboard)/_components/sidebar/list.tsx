'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { SidebarItem } from './item';

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <ul className='flex flex-col gap-y-2'>
      {userMemberships.data.map((membership) => (
        <SidebarItem
          key={membership.organization.id}
          id={membership.organization.id}
          name={membership.organization.name}
          imageUrl={membership.organization.imageUrl}
        />
      ))}
    </ul>
  );
};
