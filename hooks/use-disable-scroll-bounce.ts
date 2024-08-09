import { useEffect } from 'react';

export function useDisableScrollBounce() {
  useEffect(() => {
    document.body.classList.add('overflow-hidden', 'overflow-none');
    return () => {
      document.body.classList.remove('overflow-hidden', 'overflow-none');
    };
  }, []);
}
