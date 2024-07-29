import React from 'react';
import { NewButton } from './new-button';
import { List } from './list';

export const Sidebar = () => {
  return (
    <aside className='fixed z-[1] left-0 p-3 flex flex-col bg-blue-900 w-[60px] h-full gap-y-4'>
      <List />
      <NewButton />
    </aside>
  );
};
