'use client';

import { RenameModal } from '~/components/modal/rename-modal';
import { useMountedState } from 'react-use';

export const ModalProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RenameModal />
    </>
  );
};
