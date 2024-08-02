'use client';

import qs from 'query-string';
import { Search } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { Input } from '~/components/ui/input';

import React from 'react';

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>('');

  const debounceValue = useDebounceValue(value, 500);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    if (debounceValue) {
      const query = qs.stringifyUrl(
        {
          url: '/',
          query: {
            search: debounceValue[0],
          },
        },
        { skipEmptyString: true, skipNull: true }
      );
      router.push(query);
    }
  }, [debounceValue, router]);

  return (
    <div className='flex relative items-center gap-x-2 w-full'>
      <Search size={20} className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
      <Input
        value={value}
        onChange={handleChange}
        placeholder='Search'
        className='pl-8 pr-3 py-2 max-w-[516px] rounded-lg border border-muted-foreground text-muted-foreground bg-muted-background focus:outline-none focus:border'
      />
    </div>
  );
};
