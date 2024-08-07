'use client';

import { memo } from 'react';
import { Cursor } from './cursor';
import { useOthersConnectionIds } from '~/liveblocks.config';

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <g>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </g>
  );
};

export const CursorsPresence = memo(() => {
  return <Cursors />;
});

CursorsPresence.displayName = 'CursorsPresence';
