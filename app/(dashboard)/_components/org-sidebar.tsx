'use client';

import { OrganizationSwitcher } from '@clerk/nextjs';
import { LayoutDashboard, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ModeToggle } from '~/components/theme';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import logo from '~/public/logo.png';

const font = Poppins({
  weight: ['600', '700'],
  subsets: ['latin-ext'],
});
export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const favorites = searchParams.get('favorites');

  return (
    <div className='hidden lg:flex flex-col space-y-4 w-[200px] pl-5 pt-5'>
      <ModeToggle />
      <Link href='/'>
        <div className='flex items-center gap-x-2'>
          <Image src={logo} alt='logo' width={24} height={24} className='rounded-full' />
          <p className={cn('text-sm font-semibold', font.className)}>Dashboard</p>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: 'flex',
              width: '100%',
              alignContent: 'start',
              justifyContent: 'start',
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
      <div className='w-full space-y-2'>
        <Button variant={favorites ? 'secondary' : 'default'} asChild className='flex items-center justify-start gap-x-2' size='sm'>
          <Link href='/'>
            <LayoutDashboard className='h-4 w-4' />
            Team Dashboard
          </Link>
        </Button>
        <Button variant={favorites ? 'default' : 'secondary'} asChild className='flex items-center justify-start gap-x-2' size='sm'>
          <Link
            href={{
              pathname: '/',
              query: { favorites: true },
            }}
          >
            <Star className='h-4 w-4' />
            Favorites
          </Link>
        </Button>
      </div>
    </div>
  );
};
