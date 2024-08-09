'use client';

import { memo } from 'react';
import { Cursor } from './cursor';
import { useOthersConnectionIds } from '~/liveblocks.config';
import { shallow, useOthersMapped } from '@liveblocks/react';
import { Path } from './path';
import { colorToCss } from '~/lib/utils';

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

const Draft = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.pencilColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return <Path key={key} points={other.pencilDraft} x={0} y={0} fill={other.penColor ? colorToCss(other.penColor) : 'black'} />;
        }
        return null;
      })}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
      <Draft />
    </>
  );
});

CursorsPresence.displayName = 'CursorsPresence';
