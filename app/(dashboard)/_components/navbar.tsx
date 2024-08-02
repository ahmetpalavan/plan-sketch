'use client';

import { OrganizationSwitcher, UserButton, useOrganization } from '@clerk/nextjs';
import { SearchInput } from './search-input';
import { useTheme } from 'next-themes';
import { InviteButton } from './invite-button';

export const Navbar = () => {
  const { organization } = useOrganization();
  const { theme } = useTheme();
  return (
    <div className='flex items-center gap-x-4 p-5'>
      <div className='hidden lg:flex lg:flex-1'>
        <SearchInput />
      </div>
      <div className='block lg:hidden flex-1'>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: 'flex',
                width: '100%',
                alignContent: 'start',
                justifyContent: 'start',
                maxWidth: '376px',
              },
              organizationSwitcherTrigger: {
                padding: '6px',
                borderRadius: '6px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                border: '1px solid #E5E7EB',
                color: theme === 'dark' ? '#fff' : '#000',
                '&:hover': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              },
            },
          }}
        />
      </div>
      {organization && <InviteButton />}
      <UserButton />
    </div>
  );
};
