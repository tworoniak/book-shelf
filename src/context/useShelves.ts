import { useContext } from 'react';
import { ShelvesContext } from './ShelvesContext';

export function useShelves() {
  const ctx = useContext(ShelvesContext);
  if (!ctx)
    throw new Error('useShelves must be used within <ShelvesProvider>.');
  return ctx;
}
