import React from 'react';
import { ModeToggle } from '~/components/theme';

export const OrgSidebar = () => {
  return (
    <div className='hidden lg:flex flex-col space-y-6 w-[200px] pl-5 bg-red-100 pt-5'>
      <ModeToggle />
    </div>
  );
};
