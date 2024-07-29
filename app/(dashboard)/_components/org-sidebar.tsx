import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '~/components/theme';
import { cn } from '~/lib/utils';
import logo from '~/public/logo.png';

const font = Poppins({
  weight: ['600', '700'],
  subsets: ['latin-ext'],
});
export const OrgSidebar = () => {
  return (
    <div className='hidden lg:flex flex-col space-y-6 w-[200px] pl-5 pt-5'>
      <ModeToggle />
      <Link href='/'>
        <div className='flex items-center gap-x-2'>
          <Image src={logo} alt='logo' width={24} height={24} className='rounded-full' />
          <p className={cn('text-sm font-semibold', font.className)}>Dashboard</p>
        </div>
      </Link>
    </div>
  );
};
